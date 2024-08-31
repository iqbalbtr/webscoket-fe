import { useRouterContact } from "@contexts/chat/contact/RouterContactContext"
import { colors } from "../../../../../../../constants/color"
import { Icon } from "../../../../../../../constants/icons";

function ArchiveContact() {

    const { fn: { handleContent } } = useRouterContact();

    return (
        <div className={`py-4 px-3 flex justify-between border-[${colors.BORDER}] border-b-[1px] mx-6`}>
            <button
                onClick={() => handleContent("archive")}
                className="flex gap-6 text-white w-full"
            >
                <Icon name="archive" />
                <span style={{ fontSize: 16 }}>Di arsipkan</span>
            </button>
        </div>
    )
}

export default ArchiveContact
