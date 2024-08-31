import { useEffect, useState } from 'react'
import { Icon } from '../../../../../constants/icons'
import { useSendAudio } from '@contexts/chat/message/SendAudioContext'
import { colors } from '../../../../../constants/color';


const pad = (string: number) => (`0${string}`).slice(-2);
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

function SendAudio() {

    const { data, fn: { handleRecord, handleRemove, handleSend } } = useSendAudio()
    const [time, setTime] = useState(0);

    useEffect(() => {

        let interval: NodeJS.Timeout;
        if(!data.pause){
            interval = setInterval(() => setTime(pv => ++pv), 1000);
        }

        return () => clearInterval(interval);
    }, [data])

    return (
        <div className='relative w-full h-full'>
            <div
                className="flex justify-between items-center p-4 bg-bg-primary text-white"
            >
                <div className='flex items-center gap-5 mr-6'>
                    <button
                        onClick={handleRecord}
                    >
                        <Icon size={20} name={data.pause ? "mic-slash" : "mic"} />
                    </button>
                    <p>{format(time)}</p>
                </div>
                <div className="w-fit flex gap-5 justify-center items-center relative">
                    <button onClick={handleRemove}>
                        <Icon size={20} name='trash' color={colors["DANGER"]} />
                    </button>
                    <button onClick={handleSend}>
                        <Icon size={20} name="message" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SendAudio
