import { Icon } from '../../../../../constants/icons'

function Cheked({ value, action }: { value: boolean, action?: () => void }) {
    return (
        <button onClick={action} className='z-[10] relative'>
            <div className={`w-[25px] h-[25px] mx-6 my-2 relative z-10 flex border-2 ${value && "bg-green-accent border-green-accent"}`}>
                {
                    value ? (
                        <Icon name='check' />
                    ) : null
                }
            </div>
        </button>
    )
}

export default Cheked
