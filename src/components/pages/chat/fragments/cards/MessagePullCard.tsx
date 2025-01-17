import { useSession } from '@providers/AuthProvider';
import { colors } from '../../../../../constants/color';
import { usePullMessage } from '@contexts/chat/message/PullMessage.Context';

function MessagePullCard() {

    const { user: { username } } = useSession();
    const { pull, fn: { handleRemove } } = usePullMessage();

    return (
        <div className='absolute bottom-[100%] bg-bg-primary h-auto p-3 w-full flex justify-between'>
            <div
                className='bg-bg-secondary flex justify-between items-center overflow-hidden rounded-md h-[85px]'
                style={{
                    width: "100%",
                    borderLeft: "3px solid var(--green-accent)",
                }}
            >
                <div className='flex flex-col pl-4'>
                    <h5 className='text-green-accent'>{pull?.info_msg.from === username ? "You" : pull?.info_msg.from}</h5>
                    <p className='text-white' style={{ fontSize: 14, marginTop: 2 }}>{pull?.msg}</p>
                </div>
                {
                    pull?.src && (
                        <img src={pull.src} className='aspect-square h-full' alt="" />
                    )
                }
            </div>
            <button
                className='pl-6'
                style={{
                    marginRight: "22px",
                    cursor: "pointer"
                }}
                onClick={() => handleRemove()}>
                <svg xmlns="http://www.w3.org/2000/svg" width={30} viewBox="0 0 24 24" id="times">
                    <path fill={colors.ICON_COLOR}
                        d="M13.41,12l4.3-4.29a1,1,0,1,0-1.42-1.42L12,10.59,7.71,6.29A1,1,0,0,0,6.29,7.71L10.59,12l-4.3,4.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0L12,13.41l4.29,4.3a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42Z"></path>
                </svg>
            </button>
        </div>
    )
}

export default MessagePullCard
