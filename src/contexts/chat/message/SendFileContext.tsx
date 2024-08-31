// import usePhotoCompress from "@hooks/usePhotoCompress";
import React, { ReactNode, useCallback, useState } from "react"
import { useRouterMessage } from "./RouterMessageContext";
import { useMessage } from "../MessageContext";
import { useChat } from "../ChatContext";
import { useSocket } from "@providers/SocketProvider";
import privateApi from "@libs/axios";
import { useSession } from "@providers/AuthProvider";

type ContextType = {
    files: FilesPayload[];
    fn: {
        handleAddFile: (file: File, text: string, compress: boolean) => void;
        handleRemove: (url: File) => void;
        handleSendFile: () => void;
        handleResetFile: () => void;
        handleEditFile: (id: string, { type, value }: { type: keyof FilesPayload, value: any }) => void;
    }
}

type FilesPayload = {
    file: File,
    url: string,
    text: string,
    type: "files" | "idle" | "video" | "photo",
    compress: boolean;
}

export const fileViewType = "images"

const Context = React.createContext<ContextType>({
    files: [],
    fn: {
        handleAddFile: () => { },
        handleRemove: () => { },
        handleSendFile: () => { },
        handleResetFile: () => { },
        handleEditFile: () => { }
    }
})

export function useSendFile() {
    return React.useContext(Context)
}


function SendFileContext({
    children
}: {
    children: ReactNode
}) {

    const [files, setFiles] = useState<FilesPayload[]>([]);
    const { fn: { handleInnerMessage } } = useRouterMessage();
    const { socket } = useSocket()
    const { fn: { sendMessage } } = useMessage()
    const { current } = useChat();
    const { user } = useSession()


    const handleAddFile = useCallback(async (file: File, text: string, compress: boolean = true) => {

        if (file.type.includes("video") && file.size > 1024 * 1024 * 5) {
            alert("Video to large")
            return
        }

        const typeFile = compress && file.type.includes("image") ?
            "photo" : compress && file.type.includes("video") ?
                "video" : "files";

        if (file) {
            const payload: FilesPayload = {
                file: file,
                text: text,
                url: URL.createObjectURL(file),
                type: typeFile,
                compress: compress
            }
            if (!files.length) {
                handleInnerMessage("send")
            }
            setFiles(pv => [...pv, payload]);
        }
    }, [files])

    const handleSendFile = useCallback(async () => {
        if (!socket) return
        if (!current) return

       
        for(const file of files) {
            const upload = await privateApi.postForm("/upload/message", {
                user: user.username,
                file: file.file
            })
            sendMessage({
                input: file.text,
                to: current.username,
                type: current.type,
                file: upload.data.result,
                typeFile: file.type,
                src: file.url
            }, () => {
            })
        }
        setFiles([]);

        handleInnerMessage("back");


    }, [files, socket, current])

    const handleResetFile = useCallback(() => {
        setFiles([])
    }, [files])

    const handleRemoveFile = useCallback((file: File) => {
        setFiles(pv => pv.filter(foo => foo.file !== file));
    }, [files])

    const handleEditFile = useCallback((id: string, { type, value }: { type: keyof FilesPayload, value: any }) => {
        setFiles(pv => pv.map(foo => {
            if (foo.url === id) {
                return {
                    ...foo,
                    [type]: value
                }
            } else {
                return foo
            }
        }));
    }, [files])


    return (
        <Context.Provider
            value={{
                files: files,
                fn: {
                    handleAddFile: handleAddFile,
                    handleRemove: handleRemoveFile,
                    handleSendFile: handleSendFile,
                    handleResetFile: handleResetFile,
                    handleEditFile: handleEditFile
                }
            }}
        >
            {children}
        </Context.Provider>
    )
}

export default SendFileContext
