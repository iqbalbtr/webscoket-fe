import React, { useCallback, useEffect } from 'react'
import { useChat } from '../ChatContext';
import { useMessage } from '../MessageContext';
import { useMedia } from '@providers/MediaProvider';
import axios from 'axios';
import privateApi from '@libs/axios';
import { useSession } from '@providers/AuthProvider';

type AudioType = {
    status: boolean;
    pause: boolean;
    src: string
}

type ContextType = {
    data: AudioType;
    fn: {
        handleCreate: () => void;
        handleRecord: () => void;
        handleRemove: () => void;
        handleSend: () => void;
    }
}

const Context = React.createContext<ContextType>({
    data: {
        status: false,
        src: "",
        pause: false
    },
    fn: {
        handleCreate: () => { },
        handleRecord: () => { },
        handleRemove: () => { },
        handleSend: () => { },
    }
});

export function useSendAudio() {
    return React.useContext(Context)
}

function SendAudioContext({ children }: { children: React.ReactNode }) {


    const [data, setData] = React.useState<AudioType>({
        status: false,
        src: "",
        pause: false,
    });
    const { current } = useChat();
    const { user } = useSession();
    const recorder = useMedia();
    const { fn: { sendMessage } } = useMessage();

    const handleRecord = useCallback(() => {
        setData(prev => {
            if (!prev.pause) {
                recorder?.pauseRecording();
            } else {
                recorder?.resumeRecording();
            }

            console.log(recorder?.mediaBlobUrl);

            return {
                ...prev,
                src: !prev.pause ? recorder?.mediaBlobUrl || "" : prev.src,
                pause: !prev.pause
            };
        });
    }, [recorder]);

    const handleCreate = React.useCallback(() => {
        setData({
            src: "",
            pause: false,
            status: true
        });
        recorder?.startRecording();
    }, [recorder]);

    const handleRemove = React.useCallback(() => {
        setData({
            src: "",
            pause: false,
            status: false
        });
        recorder?.stopRecording();
        recorder?.clearBlobUrl();
    }, [recorder]);


    const sendAudio = useCallback(async (src: string) => {
        try {
            if (!src)
                return alert("Not exist")
            const get = await axios.get(src, {
                responseType: "blob"
            });

            const up = await privateApi.postForm("/upload/message", {
                user: user?.username,
                file: new File([get.data], "audio.wav", {
                    type: "audio/wav"
                }),
            });

            sendMessage({
                input: "",
                to: current?.username!,
                type: current?.type!,
                src: up.data.result,
                file: up.data.result,
                typeFile: "audio"
            }, (err) => {
                if (!err) {
                    setData({
                        pause: false,
                        src: "",
                        status: false
                    })
                }
            })


        } catch (error) {
            console.error("Failed to send message:", error);
        }
    }, [data, current, user])

    const handleSend = useCallback(async () => {
        recorder?.stopRecording()
        console.log(recorder?.mediaBlobUrl);
        recorder?.clearBlobUrl();
    }, [data.src, sendMessage, recorder]);

    useEffect(() => {
        if (recorder?.mediaBlobUrl && data.status) {
            sendAudio(recorder.mediaBlobUrl)
        }
    }, [recorder?.mediaBlobUrl, data])

    return (
        <Context.Provider value={{
            data: data,
            fn: {
                handleCreate: handleCreate,
                handleRecord: handleRecord,
                handleSend: handleSend,
                handleRemove: handleRemove,
            }
        }}>
            {children}
        </Context.Provider>
    )
}

export default SendAudioContext
