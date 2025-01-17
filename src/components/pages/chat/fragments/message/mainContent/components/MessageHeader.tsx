import { ContactType, useChat } from '@contexts/chat/ChatContext';
import { useContact } from '@contexts/chat/ContactContext';
import { colors } from '../../../../../../../constants/color';
import MessageListMenu from '../../../listMenu/MessageListMenu';
import ModalTransparent from '@components/core/ModalTransparent';
import { useRouterMessage } from '@contexts/chat/message/RouterMessageContext';
import { getTimeNotif } from '@utils/timeNotif';
import { useSession } from '@providers/AuthProvider';
import useCurrent from '@hooks/useCurrent';
import { useCalling } from '@contexts/chat/message/CallingMessageContext';
import { Icon } from '../../../../../../../constants/icons';

function MessageHeader() {

    const { current, fn: { handleReset } } = useChat();
    const { contact, fn: { getGroup } } = useContact();
    const { user } = useSession();
    const { fn: { handleRouterMessage } } = useRouterMessage();
    const { fn: { startCalling } } = useCalling();
    const { result } = useCurrent<ContactType>(contact, () => contact.find(fo => fo.username === current?.username))

    function getLastActive() {
        if (!current) return
        if (current?.type === "private") {
            const time = contact.find(foo => foo.username === current?.username)
            return time?.last_active === "online" ? "online" : time?.last_active ? getTimeNotif(new Date(time?.last_active!)) : " "
        } else {
            return getGroup(current.username)?.member.map(foo => foo.username === user.username ? "You" : `@${foo.username}`).join(", ")
        }
    }

    return (
        <div className={`w-full flex justify-between h-[7%] px-5 bg-bg-primary text-white items-center relative`}>
            <button className='md:hidden' onClick={() => handleReset()}>
                <Icon name='arrow-left' />
            </button>
            <div className="flex gap-4 items-center cursor-pointer" onClick={() => handleRouterMessage("user_info")}>
                {
                    result?.profile ? (
                        <img
                            src={result.profile}
                            alt=""
                        className='w-[45px] flex justify-center items-center aspect-square rounded-full bg-gray-400'
                        />
                    ) : (
                        <>
                            <span className='w-[45px] flex justify-center items-center aspect-square rounded-full bg-gray-400'>
                                {result?.name?.charAt(0).toUpperCase()}
                            </span>
                        </>
                    )
                }
                <div>
                    <h3 className='font-semibold truncate'>{result?.name.replace("%2f", " ")}</h3>
                    <span className='max-w-52 line-clamp-1 text-ellipsis'>{getLastActive()}</span>
                </div>
            </div>
            <div className='flex justify-center items-center gap-4'>
                <button
                    onClick={() => startCalling()}
                >
                    <Icon name='phone' />
                </button>
                <button onClick={() => handleRouterMessage("search")}>
                    <svg
                        width={24}
                        height={24}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        id="search">
                        <path
                            fill={colors.ICON_COLOR}
                            d="M21.71,20.29,18,16.61A9,9,0,1,0,16.61,18l3.68,3.68a1,1,0,0,0,1.42,0A1,1,0,0,0,21.71,20.29ZM11,18a7,7,0,1,1,7-7A7,7,0,0,1,11,18Z"
                        ></path>
                    </svg>
                </button>
                <ModalTransparent
                    button={() => (
                        <div
                            style={{
                                border: "none",
                                background: "transparent",
                                cursor: "pointer"
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width={25} viewBox="0 0 24 24" id="ellipsis-v">
                                <path fill={colors.ICON_COLOR}
                                    d="M12,7a2,2,0,1,0-2-2A2,2,0,0,0,12,7Zm0,10a2,2,0,1,0,2,2A2,2,0,0,0,12,17Zm0-7a2,2,0,1,0,2,2A2,2,0,0,0,12,10Z"></path>
                            </svg>
                        </div>
                    )}
                >
                    {(handleTgl) => (
                        <MessageListMenu back={handleTgl} />
                    )}
                </ModalTransparent>
            </div>
        </div>
    )
}

export default MessageHeader
