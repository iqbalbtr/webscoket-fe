import { useSendFile } from "@contexts/chat/message/SendFileContext"
import { Icon } from "../../../../../../../constants/icons"
import { useSendAudio } from "@contexts/chat/message/SendAudioContext"

function ClipMenu() {

  const { fn: { handleAddFile } } = useSendFile()
  const { fn: { handleCreate } } = useSendAudio()

  return (
    <div
      className="absolute w-[180px] animate-accordion-up z-50 left-0 bottom-[150%] overflow-hidden rounded-lg flex flex-col bg-hover-color items-start text-white"
    >
      <button
      onClick={() => handleCreate()}
        className="relative flex gap-2 px-4 py-3 hover:bg-accent-hover-color w-full"
      >
        <Icon name="mic" />
        Audio
      </button>
      <button
        className="relative flex gap-2 px-4 py-3 hover:bg-accent-hover-color w-full"
      >
        <Icon name="images" />
        Photo & video
        <input
          className="absolute z-30 top-0 left-0 right-0 bottom-0 opacity-0"
          onChange={(e) => e.target.files && handleAddFile(e.target.files[0]!, "", true)}
          type="file"
        />
      </button>
      <button
        className="relative gap-2 flex px-4 py-3 hover:bg-accent-hover-color w-full"
      >
        <Icon name="files" />
        Documents
        <input
          className="absolute z-30 top-0 left-0 right-0 bottom-0 opacity-0"
          onChange={(e) => e.target.files && handleAddFile(e.target.files[0]!, "", false)}
          type="file"
        />
      </button>
    </div>
  )
}

export default ClipMenu
