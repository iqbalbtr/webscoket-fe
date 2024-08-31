import { useChat } from '@contexts/chat/ChatContext';
import { useCalling } from '@contexts/chat/message/CallingMessageContext';
import { useSocket } from '@providers/SocketProvider';
import { useEffect, useState } from 'react';
import { Icon } from '../../../../../../../constants/icons';

const format = (seconds: number) => {
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = pad(date.getUTCSeconds());
    if (hh) {
        return `${hh}:${pad(mm)}:${ss}`;
    }
    return `${mm}:${ss}`;
};

const pad = (string: number) => (`0${string}`).slice(-2);

export default function CallingContent() {
    const { socket } = useSocket();
    const { current } = useChat();
    const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
    const { calling, status, recorder, fn: { handleClose } } = useCalling();
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        if (calling.status !== "success")
            return
        if (recorder?.status === "recording" && socket && recorder?.previewAudioStream) {
            const mediaRecorder = new MediaRecorder(recorder?.previewAudioStream);
            let audioChunks: Blob[] = [];

            mediaRecorder.addEventListener("dataavailable", event => {
                audioChunks.push(event.data);
            });

            mediaRecorder.addEventListener("stop", () => {
                const audioBlob = new Blob(audioChunks);
                audioChunks = [];
                const fileReader = new FileReader();
                fileReader.readAsDataURL(audioBlob);
                fileReader.onloadend = () => {
                    const base64String = fileReader.result;
                    socket?.emit("calling:stream", base64String, current?.username);
                };
            });

            const recordingInterval = setInterval(() => {
                mediaRecorder.stop();
                return setTimeout(() => {
                    mediaRecorder.start();
                }, 500);
            }, 500);

            return () => {
                clearInterval(recordingInterval);
                mediaRecorder.stop();
            };
        }
    }, [recorder?.status, socket, calling]);

    useEffect(() => {

        if (calling.status !== "success")
            return
        if (calling.contact) {
            socket?.on('calling:stream', (audioData) => {
                let newData = audioData.split(";");
                newData[0] = "data:audio/ogg;";
                newData = newData[0] + newData[1];

                if (!audioElement) {
                    const newAudio = new Audio(newData);
                    setAudioElement(newAudio);
                    newAudio.play();
                } else {
                    audioElement.src = newData;
                    audioElement.play();
                }
            });
        }

        return () => {
            socket?.off("calling:stream");
            if (audioElement) {
                audioElement.pause();
                setAudioElement(null);
            }
        };
    }, [socket, calling, audioElement]);

    useEffect(() => {
        if(calling.status === "success"){
            const interval = setInterval(() => setDuration(pv => ++pv), 1000);

            return () => clearInterval(interval);
        }
    }, [calling])

    return (
        <div className={`min-h-full fixed bg-bg-secondary/50 backdrop-blur-sm top-0 left-0 w-full flex justify-center z-[999]`}>
            <div className='h-screen flex flex-col justify-between text-white items-center py-32'>
                <h3 className='text-4xl'>
                    {calling.status === "loading" ? "Calling" : calling.status === "success" ? calling.contact?.name.split("%2f").join(" ") : status === "reject" ? "Di tolak" : "Prepare RTC"}
                </h3>
                <h3 className='pb-24 text-5xl font-bold'>
                    {format(duration)}
                </h3>
                <div className='w-[450px] flex justify-evenly p-6 rounded-md bg-bg-primary'>
                    <button
                        onClick={() => recorder?.isAudioMuted ? recorder?.unMuteAudio() : recorder?.muteAudio()}
                        className='p-2 bg-white rounded-full'
                    >
                        <Icon color='#000' name={recorder?.isAudioMuted ? "mic-slash" : "mic"} />
                    </button>
                    <button 
              className='p-2 bg-red-600 rounded-full'
                    onClick={() => {
                        recorder?.stopRecording()
                        setTimeout(() => {
                            handleClose("idle")
                        }, 1000)
                    }}
                    >
                        <Icon color='#fff' name={"phone"} />
                    </button>
                </div>
            </div>
        </div>
    );
}
