import { ContactType, useChat } from '@contexts/chat/ChatContext';
import { useContact } from '@contexts/chat/ContactContext';
import { useRouterMessage } from '@contexts/chat/message/RouterMessageContext';
import { colors } from '../../../../../../../constants/color';
import { Icon } from '../../../../../../../constants/icons';
import { useMessage } from '@contexts/chat/MessageContext';
import { PhotoView } from 'react-photo-view';
import { useSearchMessage } from '@contexts/chat/message/SearchMessagteContext';
import { RouteMessageProfile } from '../MessageProfileContent';
import { useNotif } from '@contexts/NotificationContext';

function ContactOption({ data, handleRoute }: { data: ContactType, handleRoute: (data: RouteMessageProfile) => void }) {

    const { fn: { removeCurrent } } = useChat();
    const { fn: { handleModalMessage, handleRouterMessage } } = useRouterMessage();
    const { fn: { removeContact } } = useContact();
    const { fn: { handleArchive, handleBlock } } = useContact()
    const { message } = useMessage();
    const { fn: { handleRefClick } } = useSearchMessage()
    const { notifAlert } = useNotif()
    const medias = message.filter(fo => ["photo", "files", "video"].includes(fo.type))

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
                        medias.map(fo =>
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
                        )
                    }
                </div>
            </div>
            <div className='flex flex-col gap-2 bg-bg-secondary min-h-full'>
                <div className='flex flex-col gap-4 py-4 bg-bg-secondary items-start min-h-full'>
                    {
                        data?.unsaved ? (
                            <button
                                className='flex gap-5 hover:bg-accent-hover-color w-full text-left px-8 py-3.5 font-semibold'
                                onClick={() => handleRoute("contact")}
                            >
                                <Icon name='user-plus' />
                                Tambah
                            </button>
                        ) : (
                            <button
                                className='flex gap-5 hover:bg-accent-hover-color w-full text-left px-8 py-3.5 font-semibold'
                                onClick={() => handleRoute("contact")}
                            >
                                <Icon name='pen' />
                                Edit
                            </button>
                        )
                    }

                    <button
                        className='flex gap-5 hover:bg-accent-hover-color w-full text-left px-8 py-3.5 font-semibold'
                        onClick={() => removeContact(data?.id!, (err) => {
                            if (!err) {
                                notifAlert({
                                    card: "alert",
                                    message: "Success remove contact"
                                })
                                removeCurrent();
                                handleRouterMessage("back")
                            }
                        })}
                    >
                        <Icon name='trash' />
                        Remove Contact
                    </button>
                    <button
                        className='flex gap-5 hover:bg-accent-hover-color w-full text-left px-8 py-3.5 font-semibold'
                        onClick={() => handleModalMessage("share")}
                    >
                        <Icon name='share' />
                        Share
                    </button>
                    <button
                        className='flex gap-5 hover:bg-accent-hover-color w-full text-left px-8 py-3.5 font-semibold'
                        onClick={() => data?.archive ? handleArchive(false) : handleArchive(true)}
                    >
                        <Icon name='archive' />
                        {data.archive ? "Unarchive" : "Archive"}
                    </button>
                </div>

            </div>
            <div className='flex flex-col py-4  bg-bg-secondary items-start pb-6 text-danger'>
                <button className='flex gap-5 hover:bg-accent-hover-color w-full text-left px-8 py-3.5 font-semibold'
                    onClick={() => data?.block ? handleBlock(false) : handleBlock(true)}
                >
                    <Icon name='ban' color={colors["DANGER"]} />
                    {data.block ? "Unblock" : "Block"}
                </button>
                <button className='flex gap-5 hover:bg-accent-hover-color w-full text-left px-8 py-3.5 font-semibold'>
                    <Icon name='pen' color={colors["DANGER"]} />
                    Delete Chat
                </button>
            </div>
        </div>
    )
}

export default ContactOption
