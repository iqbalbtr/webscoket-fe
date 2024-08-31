import { useMessage } from '@contexts/chat/MessageContext'
import { useChat } from '@contexts/chat/ChatContext';
import { useRouterMessage } from '@contexts/chat/message/RouterMessageContext';
import { useContact } from '@contexts/chat/ContactContext';

function MessageListMenu({ back }: { back: () => void }) {

  const { contact } = useContact()
  const { fn: { removeAllMessage } } = useMessage();
  const { fn: { handleRouterMessage, handleModalMessage } } = useRouterMessage();
  const chat = useChat();
  const { fn: { handleArchive } } = useContact()
  const currentContact = contact.find(foo => foo.username === chat.current?.username)

  function hanldeButton(fn: () => void) {
    fn()
    back()
  }


  return (
    <div
      className="w-[240px] absolute overflow-hidden animate-accordion-down rounded-lg border-2 border-border-color right-0 bg-hover-color   flex flex-col items-start z-50"
    >
      <button
        className='hover:bg-accent-hover-color w-full text-left px-5 py-3.5 font-semibold'
        onClick={() => hanldeButton(() => handleRouterMessage("user_info"))}>
        Info kontak
      </button>
      <button
        className='hover:bg-accent-hover-color w-full text-left px-5 py-3.5 font-semibold'
        onClick={() => hanldeButton(() => removeAllMessage(chat.current?.id!))}
      >
        Hapus chat
      </button>
      <button onClick={() => handleArchive(currentContact?.archive ? false : true)}
        className='hover:bg-accent-hover-color w-full text-left px-5 py-3.5 font-semibold'
      >
        {currentContact?.archive ? "Buka Arsip" : "Arsipkan"}
      </button>
      <button onClick={() => {handleModalMessage("share"); back();}}
        className='hover:bg-accent-hover-color w-full text-left px-5 py-3.5 font-semibold'
      >
        Share
      </button>
    </div>
  )
}

export default MessageListMenu
