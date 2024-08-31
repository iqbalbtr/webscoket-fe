import { Dispatch, SetStateAction, useState } from 'react'
import HeaderContactLayout from '../../HeaderContactLayout'
import ContactContentLayout from '../../ContactContentLayout'
import { Icon } from '../../../../../../../constants/icons'
import ImageCropInput from '../../profileContent/ImageCropInput';

function DetailGroup({ back, handleGroup, handleCreate }: { back: Dispatch<SetStateAction<boolean>>, handleGroup: any, handleCreate: any }) {

    const [tgl, setTgl] = useState(false);
    const [profile, setProfile] = useState<{ file?: Blob, url: string }>({
        url: "",
        file: undefined
    })

    return (
        <ContactContentLayout>
            <HeaderContactLayout
                label='New Group'
                back={() => back(pv => !pv)}
            />
            <div className='flex flex-col px-10 text-white'>

                {/* Profile Photo start */}
                <div className='w-full flex justify-center relative py-12 pb-16'>
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
                                <img
                                    src={profile.url ?? ""}
                                    alt="profile.png"
                                    onClick={() => setTgl(true)}
                                    className='text-5xl text-white w-[200px] flex justify-center items-center aspect-square rounded-full bg-gray-500'
                                />
                            </>
                        )
                    }
                </div>
                {/* Profile Photo end */}

                <div className='flex flex-col gap-3'>
                    <input
                        placeholder='Group Name'
                        type="text"
                        className={`bg-transparent py-2 w-full outline-none text-base text-white border-b-2 border-hover-color focus:border-green-accent`}
                        onChange={(e) => handleGroup("name", e.target.value)}
                    />
                    <input
                        placeholder='Group subject (optional)'
                        type="text"
                        className={`bg-transparent py-2 w-full outline-none text-base text-white border-b-2 border-hover-color focus:border-green-accent`}
                        onChange={(e) => handleGroup("bio", e.target.value)}
                    />
                </div>

                <div className='w-full flex justify-center pb-4 bg-bg-secondary py-5 pt-32'>
                    <button
                        onClick={handleCreate}
                        className='bg-green-accent p-2 rounded-full'
                    >
                        <Icon name='check' color='#fff' size={35} />
                    </button>
                </div>
            </div>
        </ContactContentLayout>
    )
}

export default DetailGroup
