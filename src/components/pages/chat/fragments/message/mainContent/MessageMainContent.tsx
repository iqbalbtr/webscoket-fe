import ChatHeader from './components/MessageHeader'
import SendPhoto from './components/SendPhoto';
import SwitchLayout from '@components/layouts/SwitchLayout';
import ListMessage from './components/ListMessage';
import { useRouterMessage } from '@contexts/chat/message/RouterMessageContext';
import { useEffect } from 'react';
import { useMessage } from '@contexts/chat/MessageContext';
import { useChat } from '@contexts/chat/ChatContext';
import CallingContent from './components/CallingContent';

function MessageMainContent() {

    const { inner } = useRouterMessage()
    const { position, fn: { handleRetriveMessage } } = useMessage()
    const { current } = useChat()

    useEffect(() => {
        const container = document.getElementById("message-container");

        const handleScroll = () => {
            const scrollTop = container?.scrollTop || 0;
            // const scrollHeight = container?.scrollHeight || 0;
            // const clientHeight = container?.clientHeight || 0;

            if (scrollTop === 0) {
                handleRetriveMessage()
            }

            // if (scrollTop + clientHeight === scrollHeight) {
            //     console.log('Reached the bottom');
            // }
        };

        // Pasang event listener pada scroll
        container?.addEventListener('scroll', handleScroll);

        // Hapus event listener saat komponen unmount
        return () => {
            container?.removeEventListener('scroll', handleScroll);
        };
    }, [position, current]);

    return (
        <div
            className={`w-full md:relative min-h-[97.5vh] flex-col transition-all duration-150`}
        >
            <ChatHeader />
            <SwitchLayout
                data={[
                    {
                        name: "send",
                        children: <SendPhoto />
                    },
                    {
                        name: "calling",
                        children: <CallingContent />
                    },
                    {
                        name: "idle",
                        children: <ListMessage />
                    }
                ]}
                name={inner}
            />
        </div>
    )
}

export default MessageMainContent
