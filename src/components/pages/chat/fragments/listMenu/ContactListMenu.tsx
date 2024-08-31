import { useEffect } from 'react'
import { useSession } from '@providers/AuthProvider'
import { useRouterContact } from '@contexts/chat/contact/RouterContactContext';
import { useChat } from '@contexts/chat/ChatContext';



function ContactMenuList({ handleTgl }: { handleTgl: () => void; }) {

  const { status, logout } = useSession();
  const { fn: { removeCurrent } } = useChat();
  const { content, fn: { handleContent } } = useRouterContact();

  useEffect(() => {
    if (content.length === 2) {
      handleTgl()
    }
  }, [content])

  return (
    <div
      className={`w-[240px] bg-bg-container rounded-lg border border-accent-hover-color animate-accordion-down overflow-hidden text-white flex flex-col items-start absolute top-full right-0 z-50`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className='flex flex-col w-full items-start pb-3'>
        <button
          className='hover:bg-accent-hover-color text-left font-semibold py-3 px-4 w-full'
          onClick={() => {
            handleContent("profile")
          }}
        >
          See Profile
        </button>
        <button
          className='hover:bg-accent-hover-color text-left font-semibold py-3 px-4 w-full'
          onClick={() => {
            handleContent("new_contact")
          }}
        >
          New Contact
        </button>

        {/* <button
          className='hover:bg-accent-hover-color text-left font-semibold py-3 px-4 w-full'
          onClick={() => {
            handleContent("group")
          }}
        >
          Buat Grup
        </button> */}
        <button
          className='hover:bg-accent-hover-color text-left font-semibold py-3 px-4 w-full'
          onClick={() => {
            handleContent("settings")
          }}
        >
          Setting
        </button>
        <button
          className='hover:bg-accent-hover-color text-left font-semibold py-3 px-4 w-full'
          onClick={() => {
            logout()
            removeCurrent()
          }} disabled={status === "loading"}>

          {status === "loading" ? "Loading..." : "Sign out"}
        </button>
      </div>
    </div>
  )
}

export default ContactMenuList
