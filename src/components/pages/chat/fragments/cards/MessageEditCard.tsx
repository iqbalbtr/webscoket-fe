import { colors } from '../../../../../constants/color';
import { useEditMessage } from '@contexts/chat/message/EditMessageContext';

function MessageEditCard() {

    const { edit, fn: { handleEdit } } = useEditMessage();

    return (
        <div className='absolute bottom-[100%] bg-bg-primary h-auto p-3 w-full flex justify-between'>
            <div
                className='bg-green-primary flex justify-between items-center overflow-hidden rounded-md h-[65px]'
                style={{
                    width: "100%",
                }}
            >
                <div className='flex flex-col pl-4'>
                    <p className='text-white font-semibold' style={{ fontSize: 14, marginTop: 2 }}>{edit?.msg}</p>
                </div>
            </div>
            <button
                className='pl-6'
                style={{
                    marginRight: "22px",
                    cursor: "pointer"
                }}
                onClick={() => handleEdit(null)}>
                <svg xmlns="http://www.w3.org/2000/svg" width={30} viewBox="0 0 24 24" id="times">
                    <path fill={colors.ICON_COLOR}
                        d="M13.41,12l4.3-4.29a1,1,0,1,0-1.42-1.42L12,10.59,7.71,6.29A1,1,0,0,0,6.29,7.71L10.59,12l-4.3,4.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0L12,13.41l4.29,4.3a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42Z"></path>
                </svg>
            </button>
        </div>
    )
}

export default MessageEditCard
