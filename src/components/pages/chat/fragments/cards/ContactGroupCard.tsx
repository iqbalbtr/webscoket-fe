import { GroupContact } from '@contexts/chat/ChatContext'

function ContactGroupCard({ data }: { data: GroupContact }) {
    return (
        <div
            className={`bg-bg-secondary w-full px-6 p-2 py-3 border-b-[1px] border-[#212c33] text-white hover:bg-hover-color`}
        >
            <div
                className="flex w-full"
            >
                <span
                    className="w-[55px] aspect-square rounded-full bg-gray-500 flex items-center justify-center text-xl"
                >
                    {data.username.charAt(0) || "@"}
                </span>
                <div
                    className="ml-3 flex w-full justify-between items-center"
                >
                    <div className='flex flex-col items-start'>
                        <h3 className="font-semibold">@{data.username}</h3>
                        <div>
                            <p
                                className="text-icon-color text-sm"
                            >{data.bio}</p>
                        </div>
                    </div>
                    <span className='px-2 py-1 h-fit rounded-md border border-green-primary'>{data.role}</span>
                </div>
            </div>
        </div>
    )
}

export default ContactGroupCard
