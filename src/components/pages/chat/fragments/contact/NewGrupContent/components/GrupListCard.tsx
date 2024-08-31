import { ContactType } from "@contexts/chat/ChatContext"
import { Icon } from "../../../../../../../constants/icons"

function GrupListCard({ data, action }: { data: ContactType, action: (contact: ContactType) => void }) {
    return (
        <div className="p-2 text-white rounded-full flex items-center gap-2 bg-hover-color">
            <span className="w-[25px] aspect-square rounded-full bg-gray-500 flex justify-center items-center">{data.username.charAt(0).toUpperCase()}</span>
            <h3>{data.name}</h3>
            <button 
            className="hover:bg-white rounded-full "
            onClick={() => action(data)}>
                <Icon name="times" />
            </button>
        </div>
    )
}

export default GrupListCard
