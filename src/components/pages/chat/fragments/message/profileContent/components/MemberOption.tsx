import { useRouterMessage } from '@contexts/chat/message/RouterMessageContext';
import { Icon } from '../../../../../../../constants/icons';
import { GroupContact, useChat } from '@contexts/chat/ChatContext';
import { useState } from 'react';
import { roles } from '../../../../../../../constants/code';
import { useGroupContact } from '@contexts/chat/contact/GroupContactContext';
import { useSocket } from '@providers/SocketProvider';


function MemberOption({ data }: { data: GroupContact }) {

    const { fn: { handleModalMessage } } = useRouterMessage();
    const { fn: { handleRoleGroup, handleLeaveMember } } = useGroupContact()
    const {current} = useChat()
    const { socket } = useSocket()
    const [admin, setAdmin] = useState(data.role === roles["ADMIN"])

    function handleRole() {
        const payload = {
            role: admin ? roles["MEMBER"] : roles["ADMIN"],
            member_id: data.id
        }
        socket?.emit("group-role", payload, (err: string, res: any) => {
            if (!err) {
                handleRoleGroup(res.group_code, res.member_id, payload.role)
                setAdmin(!admin)
            }
        })
    }

    function handleKick(){
        const payload = {
            group_code: current?.username,
            member_id: data.id
        }
        socket?.emit("group-kick", payload, (err: string, res: any) => {
            if (res) {
                handleLeaveMember(current?.username!, data.id)
            }
            console.log(err);
            
        })
    }

    return (
        <div className="bg-[#0c1317] py-3 flex flex-col gap-3 pb-16">
            <div className='flex flex-col gap-2 py-4 px-6 bg-bg-secondary'>
                <h3 className='text-icon-color '>About</h3>
                <p>{data?.bio || "-"}</p>
            </div>
            <div className='flex flex-col gap-2 bg-bg-secondary min-h-full'>
                <div className='flex flex-col py-4 bg-bg-secondary items-start min-h-full'>
                    <button
                        className='flex gap-5 hover:bg-accent-hover-color w-full text-left px-8 py-3.5 font-semibold'
                        onClick={handleRole}
                    >
                        <Icon name='user-md' />
                        Make group {admin ? "memeber" : "admin"}
                    </button>
                    <button
                        className='flex gap-5 hover:bg-accent-hover-color w-full text-left px-8 py-3.5 font-semibold'
                        onClick={handleKick}
                    >
                        <Icon name='trash' />
                        Remove from group
                    </button>
                    <button
                        className='flex gap-5 hover:bg-accent-hover-color w-full text-left px-8 py-3.5 font-semibold'
                        onClick={() => handleModalMessage("share")}
                    >
                        <Icon name='chat' />
                        Chat
                    </button>
                    <button
                        className='flex gap-5 hover:bg-accent-hover-color w-full text-left px-8 py-3.5 font-semibold'
                        onClick={() => handleModalMessage("share")}
                    >
                        <Icon name='user-plus' />
                        Add New Contact
                    </button>
                </div>

            </div>
        </div>
    )
}

export default MemberOption
