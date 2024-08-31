import React, { useEffect } from 'react'
import { useChat } from '@contexts/chat/ChatContext';
import { useMessage } from '@contexts/chat/MessageContext';
import MessagePullCard from '../../../cards/MessagePullCard';
import ClipMenu from './ClipMenu';
import { colors } from '../../../../../../../constants/color';
import ModalTransparent from '@components/core/ModalTransparent';
import SelectMenuMessage from '../../SelectMenuMessage';
import { useSelectMessage } from '@contexts/chat/message/SelectMessageContext';
import { usePullMessage } from '@contexts/chat/message/PullMessage.Context';
import { useEditMessage } from '@contexts/chat/message/EditMessageContext';
import MessageEditCard from '../../../cards/MessageEditCard';
import { useSendAudio } from '@contexts/chat/message/SendAudioContext';
import SendAudio from '../../SendAudio';
import { Icon } from '../../../../../../../constants/icons';


function SendMessage() {


    const { current } = useChat();
    const [input, setInput] = React.useState("");
    const { select } = useSelectMessage();
    const { pull, fn: { handleRemove } } = usePullMessage();
    const { data } = useSendAudio()
    const { fn: { sendMessage } } = useMessage();
    const { edit, fn: { handleEdit } } = useEditMessage()


    function handleSending() {
        sendMessage({
            input: input,
            to: current?.username!,
            type: edit ? "edit" : current?.type!,
            pull: pull?.id ? pull.id : undefined,
            idEdit: edit?.id
        }, (err) => {
            if (!err) {
                setInput("");
                if (pull) {
                    handleRemove()
                }
            }
        })
        handleEdit(null)
    }

    useEffect(() => {
        setInput(edit?.msg || "")
    }, [edit])

    return (
        data.status ?
            <SendAudio /> :
            select.status ?
                <SelectMenuMessage /> : (
                    <div className='relative h-full'>
                        {
                            pull ? <MessagePullCard /> :
                                edit && <MessageEditCard />
                        }
                        <div
                            className="flex justify-center items-center bg-bg-primary"
                            style={{
                                bottom: pull ? "50px" : "0px"
                            }}
                        >
                            <ModalTransparent
                                button={(tgl) => (
                                    <div className={`${tgl ? "pt-1.5" : "rotate-45"} pl-4 pr-2 transition-all`}>
                                        <Icon name='times' />
                                    </div>
                                )}
                            >
                                {() => (
                                    <ClipMenu />
                                )}
                            </ModalTransparent>

                            <div className="w-full flex gap-5 justify-center items-center p-4 relative">
                                <input
                                    type="text"
                                    value={input} onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSending()}
                                    className={"w-full bg-hover-color p-1 rounded-md text-white outline-none"}
                                />
                                <button
                                    onClick={handleSending}
                                >
                                    <Icon name='message' />
                                </button>
                            </div>
                        </div>
                    </div>
                )
    )
}

export default SendMessage
