import MessageContentLayout from '../../MessageContentLayout'
import { PhotoProvider } from 'react-photo-view'
import { Icon } from '../../../../../../../constants/icons'
import { GroupContact, useChat } from '@contexts/chat/ChatContext';
import { useContact } from '@contexts/chat/ContactContext';
import { useRouterMessage } from '@contexts/chat/message/RouterMessageContext';
import GroupOption from './GroupOption';
import ContactOption from './ContactOption';
import { RouteMessageProfile } from '../MessageProfileContent';

function ProfileContent({
    handleRoute,
    handleMember
}: {
    handleRoute: (data: RouteMessageProfile) => void, 
    handleMember: (data: GroupContact) => void
}) {

    const { current } = useChat();
    const { fn: { getGroup } } = useContact();
    const { contact } = useContact()
    const { fn: { handleRouterMessage } } = useRouterMessage();
    const currentContact = contact.find(foo => foo.username === current?.username);
    const group = getGroup(currentContact?.username!);


    function getLastActive() {
        if (current?.type === "group") {
            return `group ${getGroup(current.username)?.member.length} anggota`
        } else {
            return `@${current?.username}`
        }
    }

    return (
        <MessageContentLayout>
            <PhotoProvider>
                <div className={`bg-bg-primary flex gap-2 px-3 items-center py-3.5`}>
                    <button
                        style={{
                            cursor: "pointer"
                        }}
                        onClick={() => handleRouterMessage("back")}
                    >
                        <Icon name='times' size={30} />
                    </button>

                    <h3>Info kontak</h3>
                </div>
                <div className='w-full max-h-[95vh] overflow-scroll'>
                    <div className=" w-full flex flex-col justify-center items-center py-16">
                        {
                            current?.profile ? (
                                <img
                                    src={current.profile}
                                    alt=""
                                    className='w-[190px] aspect-square rounded-full bg-icon-color flex justify-center items-center text-3xl'
                                />
                            ) : (
                                <span
                                    className='w-[190px] aspect-square rounded-full bg-icon-color flex justify-center items-center text-3xl'
                                >
                                    {current?.username?.charAt(0).toUpperCase()}
                                </span>
                            )
                        }
                        <h1
                            className='flex pt-6 text-2xl'
                        >
                            {current?.name.replace("%2f", " ")}
                        </h1>
                        <h4
                            className='text-icon-color my-2'
                        >
                            {getLastActive()}
                        </h4>

                    </div>
                    {
                        currentContact?.type === "group" ?
                            <GroupOption data={group!} handleRoute={handleRoute} handleMember={handleMember} /> :
                            <ContactOption data={currentContact!} handleRoute={handleRoute} />
                    }
                </div>
            </PhotoProvider>
        </MessageContentLayout>
    )
}
export default ProfileContent
