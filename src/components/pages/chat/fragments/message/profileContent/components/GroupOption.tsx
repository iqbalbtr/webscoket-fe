import { GroupContact, GroupType, useChat } from "@contexts/chat/ChatContext";
import ContactGroupCard from "../../../cards/ContactGroupCard";
import { useRouterMessage } from "@contexts/chat/message/RouterMessageContext";
import { Icon } from "../../../../../../../constants/icons";
import { useGroupContact } from "@contexts/chat/contact/GroupContactContext";
import { useSocket } from "@providers/SocketProvider";
import { useSession } from "@providers/AuthProvider";
import { colors } from "../../../../../../../constants/color";
import { PhotoView } from "react-photo-view";
import { useMessage } from "@contexts/chat/MessageContext";
import { useSearchMessage } from "@contexts/chat/message/SearchMessagteContext";
import { RouteMessageProfile } from "../MessageProfileContent";

function GroupOption({
    data,
    handleRoute,
    handleMember
}: {
    data: GroupType,
    handleRoute: (data: RouteMessageProfile) => void,
    handleMember: (data: GroupContact) => void

}) {

    const { fn: { handleModalMessage } } = useRouterMessage();
    const { fn: { handleRefClick } } = useSearchMessage()
    const { fn: { handleDisbandGroup } } = useGroupContact();
    const { socket } = useSocket();
    const { current } = useChat()
    const { message } = useMessage()
    const { user } = useSession();
    const medias = message.filter(fo => ["photo", "files", "video"].includes(fo.type))

    function handleDisband() {
        socket?.emit("group-disband", {
            group_code: current?.username
        }, (err: string, result: { group_code: string }) => {
            if (!err) {
                handleDisbandGroup(result.group_code)
            }
        })
    }

    function handleLeave() {
        socket?.emit("group-leave", {
            group_code: current?.username,
            member_id: data.member.find(fo => fo.username === user.username)?.id
        }, () => {
            handleDisbandGroup(current?.username!)
        })
    }

    function handleProfileMember(member: GroupContact) {
        handleMember(member)
        handleRoute("profile_member")
    }

    return (
        <div className="bg-[#0c1317] py-3 flex flex-col gap-3 pb-16">
            <div className='flex flex-col gap-2 py-4 px-6 bg-bg-secondary'>
                <h3 className='text-icon-color '>About</h3>
                <p>{data?.bio || "-"}</p>
            </div>
            <div className='flex flex-col gap-2 py-4 px-6 bg-bg-secondary'>
                <h3 className='text-icon-color '>Media</h3>
                <div className='flex flex-wrap gap-2'>
                    {
                        medias.length ? medias.map(fo =>
                            fo.type == "photo" ? (
                                <PhotoView src={fo.src}>
                                    <img src={fo.src} className='w-12 object-cover aspect-square' alt="photo.png" />
                                </PhotoView>
                            ) : fo.type == "video" ? (
                                <video
                                    onClick={() => handleRefClick(fo.id!)}
                                    className='w-12 object-cover aspect-square'
                                    src={fo.src}
                                ></video>
                            ) : (
                                <button
                                    onClick={() => handleRefClick(fo.id!)}
                                    className='w-12 aspect-square border flex items-center justify-center border-hover-color rounded-md'
                                >
                                    <Icon name='files' />
                                </button>
                            )
                        ) : (
                            <span className="pt-2 text-icon-color">No Media</span>
                        )
                    }
                </div>
            </div>
            {
                data?.member.length! >= 1 && (
                    <div className='flex flex-col gap-2 py-4 bg-bg-secondary'>
                        <h3 className='text-icon-color py-2 px-6'>Member</h3>
                        <div className='flex flex-col'>
                            {
                                data?.member.map(fo =>
                                    <button onClick={() => handleProfileMember(fo)} key={fo.id} >
                                        <ContactGroupCard data={fo} />
                                    </button>
                                )
                            }
                        </div>
                    </div>
                )
            }
            <div className='flex flex-col gap-2 bg-bg-secondary min-h-full'>
                <div className='flex flex-col gap-4 py-4 bg-bg-secondary items-start min-h-full'>
                    <button
                        onClick={() => handleRoute("edit_group")}
                        className='flex gap-5 hover:bg-accent-hover-color w-full text-left px-8 py-3.5 font-semibold'
                    >
                        <Icon name="pen" size={20} />
                        Edit
                    </button>
                    <button
                        onClick={() => handleModalMessage("share")}
                        className='flex gap-5 hover:bg-accent-hover-color w-full text-left px-8 py-3.5 font-semibold'
                    >
                        <Icon name="share" size={20} />
                        Bagikan
                    </button>
                </div>

            </div>
            <div className='flex flex-col py-4  bg-bg-secondary items-start pb-6 text-danger'>
                <button className='flex gap-5 hover:bg-accent-hover-color w-full text-left px-8 py-3.5 font-semibold'>
                    <Icon color={colors["DANGER"]} name="comment-download" size={20} />
                    Delete chat
                </button>
                <button onClick={handleLeave} className='flex gap-5 hover:bg-accent-hover-color w-full text-left px-8 py-3.5 font-semibold'>
                    <Icon color={colors["DANGER"]} name="sign-out" size={20} />
                    Leave group
                </button>
                <button onClick={handleDisband} className='flex gap-5 hover:bg-accent-hover-color w-full text-left px-8 py-3.5 font-semibold'>
                    <Icon color={colors["DANGER"]} name="trash" size={20} />
                    Disband group
                </button>
            </div>
        </div>
    )
}

export default GroupOption
