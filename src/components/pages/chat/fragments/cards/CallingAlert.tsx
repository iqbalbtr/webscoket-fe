import { useCalling } from '@contexts/chat/message/CallingMessageContext'
import { Icon } from '../../../../../constants/icons'

export default function CallingAlert() {

    const { calling, fn: { handlePick, handleClose } } = useCalling()

    return (
        <div className='px-4 py-2 border-2 h-auto w-[400px] z-[99999] absolute bottom-20 right-6 transition-opacity flex items-start rounded-md gap-4 border-accent-hover-color bg-hover-color text-white overflow-hidden'>
            <i className='mt-2 rounded-full bg-green-primary'>
                <Icon classname="p-2" size={40} name="bell" />
            </i>
            <div className='w-full'>
                <div className='border-b-2 flex justify-between w-full border-accent-hover-color py-1 font-bold text-icon-color'>
                    <h4>Calling from {calling.contact?.name.split("%2f")[1]}</h4>
                </div>
                <div className='w-full flex justify-start items-center gap-2 pb-2 pt-2'>
                    <button
                        className='py-1 px-4 bg-green-primary text-white rounded-md ring-green-700 font-semibold'
                        onClick={handlePick}
                    >
                        Pick
                    </button>
                    <button
                        className='py-1 px-4 bg-red-600 text-white rounded-md ring-red-700 font-semibold'
                        onClick={() => handleClose("reject")}
                    >
                        Reject
                    </button>
                </div>
            </div>
        </div>
    )
}