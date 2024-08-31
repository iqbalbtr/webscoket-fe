import { useRef, useState } from "react"
import { Icon } from "../../../../../../constants/icons";

function PrfofleInputField({ action, value }: { action: () => Promise<void>, value: string }) {

    const [focus, setFocus] = useState(false);
    const [string, setString] = useState(value);
    const field = useRef<HTMLInputElement | null>(null);

    async function handleSubmit() {

        if (!string) return;

        await action();
        setFocus(false);
    }

    return (
        <div className='relative w-full'>
            <input
                ref={field}
                type="text"
                onFocus={() => setFocus(true)}
                value={string}
                className={`bg-transparent w-full outline-none text-base text-white focus:border-b-2 focus:border-green-primary ${focus && "border-b-2 "}`}
                onChange={(e) => setString(e.target.value)}
            />
            {
                !focus ?
                    <button
                        onClick={() => {
                            setFocus(true)
                            field.current?.focus()
                        }}
                    >
                        <Icon name="pen" classname="absolute right-1 top-1/2 -translate-y-[75%]" />
                    </button> :
                    <button
                        onClick={handleSubmit}
                    >
                        <Icon name="check" classname="absolute right-1 top-1/2 -translate-y-[75%]" />
                    </button>
            }
        </div>
    )
}

export default PrfofleInputField
