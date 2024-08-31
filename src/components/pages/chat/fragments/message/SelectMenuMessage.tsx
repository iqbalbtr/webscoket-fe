import { useRouterMessage } from "@contexts/chat/message/RouterMessageContext";
import { useSelectMessage } from "@contexts/chat/message/SelectMessageContext";
import { Icon } from "../../../../../constants/icons";

function SelectMenuMessgae() {

    const { fn: { handleModalMessage } } = useRouterMessage();
    const { select, fn: { handleActive } } = useSelectMessage();

    return (
        <div className='relative w-full h-full'>
            <div
                className="flex justify-between items-center bg-bg-primary text-white"
            >

                <div className="w-fit flex gap-3 justify-center items-center p-4 relative">
                    <button
                    onClick={() => handleActive(false)}
                    >
                        <Icon name="times" size={30} />
                    </button>
                    <p>{select.data.length} selected</p>
                </div>
                <div className="w-fit flex gap-5 justify-center items-center p-4 relative">
                    <button>
                        <Icon name="trash" />
                    </button>
                    <button onClick={() => handleModalMessage("forward")}>
                        <Icon name="orner-right" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SelectMenuMessgae
