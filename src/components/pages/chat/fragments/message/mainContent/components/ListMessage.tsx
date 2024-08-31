import { useChat } from '@contexts/chat/ChatContext';
import { useMessage } from '@contexts/chat/MessageContext';
import React, { useRef } from 'react'
import MessageCard from '../../../cards/MessageCard';
import SendMessage from './SendMessage';
import { PhotoProvider } from 'react-photo-view';

export default function ListMessage() {

    const { message, position } = useMessage();
    const { current } = useChat();
    const container = useRef<HTMLDivElement | null>(null);

    React.useEffect(() => {
        if (container.current && position.page === 1) {
            container.current.scrollTop = container.current.scrollHeight - container.current.clientHeight
        }
    }, [current, message, position])

    return (
        <PhotoProvider>
            <div className='h-full flex flex-col justify-between  overflow-hidden z-30'>
                <div
                    ref={container}
                    id='message-container'
                    className='h-[85vh] md:min-h-[86%]'
                    style={{
                        // minHeight: "86%",
                        display: "flex",
                        flexDirection: "column",
                        background: "var(--bg-secondary)",
                        overflowY: "scroll",
                        padding: "12px 26px",
                    }}
                >
                    {/* <img
                    className='h-full z-10 absolute w-full object-cover top-0 left-0 opacity-30'
                    src="" alt="" /> */}

                    {
                        message.map((data, id) => (
                            <MessageCard key={id} data={data} index={id} />
                        ))
                    }
                </div>
                <SendMessage />
            </div>
        </PhotoProvider>
    )
}
