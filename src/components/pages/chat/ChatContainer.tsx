// import React from 'react'
import NothingChat from './NothingChat';
import ChatListMessage from './fragments/message/mainContent/MessageMainContent';
import { useChat } from '@contexts/chat/ChatContext';
import SwitchLayout from '@components/layouts/SwitchLayout';
import MessageProfileContent from './fragments/message/profileContent/MessageProfileContent';
import MessageSearchContent from './fragments/message/searchContent/MessageSeacrhContent';
import ModalRouteHandler from './fragments/ModalRouteHandler';
import ShareContact from './fragments/message/profileContent/chiild/ShareContact';
import { MessageRouterType, useRouterMessage } from '@contexts/chat/message/RouterMessageContext';
import MessageForwadsModal from './fragments/message/mainContent/components/MessageForwadsModal';



function ChatContainer() {

  const { chatType, current } = useChat();
  const { content, modal } = useRouterMessage();

  return (
    <div
      className={`md:flex ${current ? "absolute" : "hidden"} transition-all top-0 left-0 right-0 bottom-0 md:relative z-0 w-full h-full bg-bg-secondary`}
    >
      {
        chatType !== "idle" ?
          <ChatListMessage /> :
          <NothingChat />
      }
      <SwitchLayout<MessageRouterType>
        name={content}
        data={[
          {
            name: "user_info",
            children: <MessageProfileContent />
          },
          {
            name: "search",
            children: <MessageSearchContent />
          }
        ]}
      />
      <ModalRouteHandler
        name={modal}
        child={[
          {
            name: "forward",
            label: "Teruskan pesan",
            children: <MessageForwadsModal />
          },
          {
            name: "share",
            label: "Bagikan kontak",
            children: <ShareContact />
          }
        ]}
      />
    </div>
  )
}

export default ChatContainer
