import { useRef, useState } from "react"
import { Icon } from "../../../../../../constants/icons";

function ProfileInputField({ action, value, placeholder }: { action: (e: React.ChangeEvent<HTMLInputElement>) => void, value: string, placeholder?: string }) {

    const [focus, setFocus] = useState(false);
    const field = useRef<HTMLInputElement | null>(null);

    return (
        <div className='relative w-full'>
            <input
                ref={field}
                type="text"
                onFocus={() => setFocus(true)}
                value={value}
                placeholder={placeholder}
                className={`bg-transparent w-full outline-none text-base text-white focus:border-b-2 focus:border-green-primary ${focus && "border-b-2 "}`}
                onChange={action}
            />
            {
                !focus &&
                <button
                    onClick={() => {
                        setFocus(true)
                        field.current?.focus()
                    }}
                >
                    <Icon name="pen" classname="absolute right-1 top-1/2 -translate-y-[75%]" />
                </button>
            }
        </div>
    )
}

export default ProfileInputField
