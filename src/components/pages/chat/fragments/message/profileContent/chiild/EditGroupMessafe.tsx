import { colors } from '../../../../../../../constants/color'
import { useChat } from '@contexts/chat/ChatContext'
import FieldEditContact from '../components/FieldEditContact'
import { useRef, useState } from 'react';
import { useContact } from '@contexts/chat/ContactContext';
import MessageContentLayout from '../../MessageContentLayout';
import { Icon } from '../../../../../../../constants/icons';
import { useSocket } from '@providers/SocketProvider';
import { RouteMessageProfile } from '../MessageProfileContent';
import ImageCropInput from '../../../contact/profileContent/ImageCropInput';
import privateApi from '@libs/axios';
import { useGroupContact } from '@contexts/chat/contact/GroupContactContext';
import { useNotif } from '@contexts/NotificationContext';

function EditGroupMessage({ handleRoute }: { handleRoute: (data: RouteMessageProfile) => void }) {

    const { current } = useChat();
    const { contact } = useContact();
    const { fn: { handleEditGroup } } = useGroupContact()
    const [isLoading, setLoading] = useState(false);
    const { socket } = useSocket()
    const currentContact = contact.find(foo => foo.username === current?.username)
    const [tgl, setTgl] = useState(false);
    const [profile, setProfile] = useState<{ file?: Blob, url: string }>({
        url: "",
        file: undefined
    })
    const { notifAlert } = useNotif()

    const form = useRef<HTMLFormElement | null>(null);

    async function handlerEdit() {
        const data = new FormData(form.current!);

        let payload = {
            group_id: current?.id,
            name: data.get("name") as string,
            bio: data.get("bio") as string,
            profile: ""
        }

        if (profile.file) {
            const up = await privateApi.post("/api/upload/profile", {
                userId: current?.id,
                profile: profile.file
            })

            payload = {
                ...payload,
                profile: up.data
            }
        }

        setLoading(true)

        socket?.emit("group-edit", payload, (err: string, result: any) => {
            if (!err) {
                handleEditGroup(result)
                setLoading(false)
                notifAlert({
                    card: "alert",
                    message: 'Success update group'
                })
            }
        })

    }

    return (
        <MessageContentLayout>
            <div className='text-white bg-bg-secondary mb-16 h-fit min-h-screen'>
                <div className={`bg-bg-primary flex gap-2 px-3 items-center py-3.5`}>
                    <button
                        style={{
                            cursor: "pointer"
                        }}
                        onClick={() => handleRoute("back")}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width={30} viewBox="0 0 24 24" id="times">
                            <path fill={colors.ICON_COLOR}
                                d="M13.41,12l4.3-4.29a1,1,0,1,0-1.42-1.42L12,10.59,7.71,6.29A1,1,0,0,0,6.29,7.71L10.59,12l-4.3,4.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0L12,13.41l4.29,4.3a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42Z"></path>
                        </svg>
                    </button>

                    <h3>Edit Group</h3>
                </div>

                <div className='flex w-full flex-col items-center justify-center p-6 relative'>
                    {
                        tgl ? (
                            <ImageCropInput data={profile} setHandle={setProfile} setTgl={setTgl} />
                        ) : (
                            <>
                                <input type="file" className='absolute opacity-0 top-0 left-0 bottom-0 right-0' onChange={(e) => {
                                    if (e.target.files?.length) {
                                        setProfile({
                                            url: URL.createObjectURL(e.target.files[0])
                                        })
                                        setTgl(!tgl)
                                    }
                                }} />
                                {
                                    profile.url ? (
                                        <img
                                            src={profile.url ?? ""}
                                            alt="profile.png"
                                            onClick={() => setTgl(true)}
                                            className='text-5xl text-white w-[200px] flex justify-center items-center aspect-square rounded-full bg-gray-500'
                                        />
                                    ) : (
                                        <span
                                            className='text-5xl text-white w-[200px] flex justify-center items-center aspect-square rounded-full bg-gray-500'
                                        >
                                            {currentContact?.username.charAt(0).toUpperCase()}
                                        </span>
                                    )
                                }
                            </>
                        )
                    }
                </div>

                <form ref={form}>
                    <div className="flex flex-col gap-2 px-10 py-4 text-white">
                        <div className="flex flex-col items-start gap-2 py-1">
                            <h2 className="text-sm">Name</h2>
                            <FieldEditContact name='name' defaultValue={currentContact?.name} />
                        </div>
                        <div className="flex flex-col items-start gap-2 py-1">
                            <h2 className="text-sm">bio</h2>
                            <FieldEditContact name='bio' defaultValue={currentContact?.bio} />
                        </div>
                    </div>

                    <div className={`py-12 flex justify-center ${isLoading && "animate-spin"}`}>
                        <button onClick={handlerEdit} type='button'>
                            <Icon name={isLoading ? "spiner" : "check"} color='#fff' size={45} classname='rounded-full bg-green-accent' />
                        </button>
                    </div>

                </form>
            </div>
        </MessageContentLayout>
    )
}

export default EditGroupMessage
