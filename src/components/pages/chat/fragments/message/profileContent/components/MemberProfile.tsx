import MessageContentLayout from '../../MessageContentLayout'
import { Icon } from '../../../../../../../constants/icons'
import MemberOption from './MemberOption'
import { RouteMessageProfile } from '../MessageProfileContent'

function MemberProfile({member, handleRoute}: {member: any, handleRoute: (data: RouteMessageProfile) => void}) {

    return (
        <MessageContentLayout>
            <div className={`bg-bg-primary flex gap-2 px-3 items-center py-3.5`}>
                <button
                    style={{
                        cursor: "pointer"
                    }}
                    onClick={() => handleRoute("back")}
                >
                    <Icon name='times' size={30} />
                </button>

                <h3>Info kontak</h3>
            </div>
            <div className='w-full max-h-[95vh] overflow-scroll'>
                <div className=" w-full flex flex-col justify-center items-center py-16">
                    {
                        member?.profile ? (
                            <img
                                src={member.profile}
                                alt=""
                                className='w-[190px] aspect-square rounded-full bg-icon-color flex justify-center items-center text-3xl'
                            />
                        ) : (
                            <span
                                className='w-[190px] aspect-square rounded-full bg-icon-color flex justify-center items-center text-3xl'
                            >
                                {member?.username?.charAt(0).toUpperCase()}
                            </span>
                        )
                    }
                    <h1
                        className='flex pt-6 text-2xl'
                    >
                        {member?.first_name}
                    </h1>
                </div>
                <MemberOption data={member!} />
            </div>
        </MessageContentLayout>
    )
}

export default MemberProfile
