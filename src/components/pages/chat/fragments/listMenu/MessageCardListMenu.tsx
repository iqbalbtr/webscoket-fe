import React from 'react'
// import MessageForwadsModal from '../message/mainContent/components/MessageForwadsModal';
import { useMessage } from '@contexts/chat/MessageContext';
import { MsgType } from '@contexts/chat/ChatContext';
import { usePullMessage } from '@contexts/chat/message/PullMessage.Context';
import { useSelectMessage } from '@contexts/chat/message/SelectMessageContext';
import { useEditMessage } from '@contexts/chat/message/EditMessageContext';
import { useSession } from '@providers/AuthProvider';

function MessageCardListMenu({ msg, setTgl }: { msg: MsgType, setTgl: React.Dispatch<React.SetStateAction<boolean>> }) {

  const { fn: { handlePull } } = usePullMessage()
  const { fn: { removeMessage } } = useMessage()
  const { fn: { handleSelect } } = useSelectMessage()
  const { fn: { handleEdit } } = useEditMessage()
  const { user } = useSession()


  return (
    <div
      className="w-[140px] animate-accordion-up border overflow-hidden rounded-md border-accent-hover-color bg-[#233138] flex flex-col items-start relative z-10"
    >
      <button
        onClick={() => {
          handleSelect(msg)
          setTgl(pv => !pv)
        }}
        className='py-3 px-4 hover:bg-accent-hover-color w-full text-left'
      >
        Teruskan
      </button>

      <button
        className='py-3 px-4 hover:bg-accent-hover-color w-full text-left'
        onClick={() => {
          handlePull(msg)
          setTgl(pv => !pv)
        }}>
        Balas
      </button>

      <button
        className='py-3 px-4 hover:bg-accent-hover-color w-full text-left'
        onClick={() => navigator.clipboard.writeText(msg.msg).then(() => alert("Berhasil di salin"))}>
        Salin
      </button>

      {
        msg.info_msg.from === user.username &&
        <button
          className='py-3 px-4 hover:bg-accent-hover-color w-full text-left'
          onClick={() => {
            handleEdit(msg)
            setTgl(pv => !pv)
          }}>
          Edit
        </button>
      }

      <button
        className='py-3 px-4 hover:bg-accent-hover-color w-full text-left'
        onClick={() => {
          removeMessage(msg.id!, (err) => {
            if (!err) {
              setTgl(pv => !pv)
            }
          })
          setTgl(pv => !pv)
        }}>
        Hapus
      </button>
    </div>
  )
}

export default MessageCardListMenu

