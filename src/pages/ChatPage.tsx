import MainLayout from '@components/layouts/MainLayout';
import ChatContainer from '@components/pages/chat/ChatContainer';
import ContactContainer from '@components/pages/chat/ContactContainer';

function ChatPage() {

  return (
    <MainLayout>
      <div
        className='max-h-[97.5vh] relative overflow-hidden w-full h-full flex'
      >
        <ContactContainer />
        <ChatContainer />
      </div>
    </MainLayout>
  )
}

export default ChatPage
