import CallingAlert from "@components/pages/chat/fragments/cards/CallingAlert";
import { Loading } from "@hooks/useFetch";
import { useSocket } from "@providers/SocketProvider";
import React, { ReactNode, useCallback, useEffect, useState } from "react";
import { useRouterMessage } from "./RouterMessageContext";
import { ContactType, useChat } from "../ChatContext";
import { useContact } from "../ContactContext";
import { ReactMediaRecorderRenderProps } from "react-media-recorder"
import { useNotif } from "@contexts/NotificationContext";
import { useMedia } from "@providers/MediaProvider";

type CallingType = {
    contact: ContactType | null;
    status: Loading;
    room_code: string;
}

type CallingStatus = "incoming" | "reject" | "unanswer" | "process" | "idle"

type Context = {
    calling: CallingType,
    status: CallingStatus,
    recorder: ReactMediaRecorderRenderProps | null
    fn: {
        handleCalling: (name: "contact" | "status", value: Loading | ContactType) => void;
        handleStatus: (val: CallingStatus) => void;
        handlePick: () => void;
        handleClose: (type: CallingStatus) => void;
        startCalling: () => void;
    }
};

const Context = React.createContext<Context>({
    status: "idle",
    calling: {
        contact: null,
        status: "idle",
        room_code: ""
    },
    recorder: null,
    fn: {
        handleCalling: () => { },
        handleStatus: () => { },
        handlePick: () => { },
        handleClose: () => { },
        startCalling: () => { },
    }
})

export function useCalling() {
    return React.useContext(Context);
}

function CallingMessageContext({ children }: { children: ReactNode }) {

    const [calling, setCalling] = useState<CallingType>({
        contact: null,
        status: "idle",
        room_code: ""
    });
    const { inner, fn: { handleInnerMessage } } = useRouterMessage()
    const { fn: { handleCurrent } } = useChat()
    const { contact } = useContact()
    const { current } = useChat()
    const { socket } = useSocket();
    const [status, setStatus] = useState<CallingStatus>("idle");
    const recorder = useMedia()
    const { notifAlert } = useNotif()

    const clearRecorder = useCallback(() => {
        recorder?.stopRecording();
        recorder?.clearBlobUrl();
    }, [recorder])

    const createCalling = useCallback(() => {
        socket?.emit("calling:create", current?.username, (err: string, result: string) => {
            if (!err) {
                handleCalling("contact", current!);
                handleCalling("status", "loading");
                handleCalling("room_code", result);
                recorder?.startRecording()
                handleInnerMessage('calling');
            } else {
                notifAlert({
                    card: "alert",
                    type: "error",
                    message: err
                });
            }
        });
    }, [socket, recorder, current])


    const handleCalling = useCallback((name: "contact" | "status" | "room_code", value: Loading | ContactType | string) => {
        setCalling(pv => ({
            ...pv,
            [name]: value
        }))
    }, [calling])

    const handleClose = useCallback((type: CallingStatus = "idle") => {
        
        clearRecorder()
        if(inner.includes("calling")){
            handleInnerMessage("back")
        }
        setStatus("idle");
        
        socket?.emit("calling:close", type, calling.contact?.username, (err?: string) => {
            if (err) {
                notifAlert({
                    card: "alert",
                    type: "error",
                    message: err
                })
            }
            setCalling({
                contact: null,
                status: "idle",
                room_code: ""
            })
        })
    }, [recorder, calling])

    const handleStatus = useCallback((val: CallingStatus) => {
        setStatus(val);
    }, [status])

    const handlePick = useCallback(() => {
        handleInnerMessage("calling");
        handleCalling("status", "success");
        socket?.emit("calling:pick", "success", calling.contact?.username, calling.room_code, (err?: string) => {
            if (err) {
                notifAlert({
                    card: "alert",
                    type: "error",
                    message: err
                })
            } 
        })
        setStatus("process")
        recorder?.startRecording()
        handleCurrent(calling.contact!, calling.contact?.type!)
    }, [socket, recorder])

    useEffect(() => {

        let delayClose: NodeJS.Timeout;

        socket?.on("calling:incoming", (user, room_code) => {
            if (user) {
                const currentCall: ContactType | undefined =
                    contact.find(foo => foo.username === user)

                if (!currentCall)
                    return
                
                handleCalling("contact", currentCall);
                handleCalling("room_code", room_code)
                setStatus("incoming")
            }
        })

        socket?.on("calling:pick", (status, from) => {
            if (from === calling.contact?.username) {
                handleCalling("status", status)
            }
        })

        socket?.on("calling:close", (type, from) => {
            if (from === calling.contact?.username) {
                setCalling({
                    contact: null,
                    status: "idle",
                    room_code: ""
                })

                setStatus(type)
                clearRecorder()
                handleInnerMessage("back")
            }
        })

        return () => {
            socket?.off("calling:incoming")
            socket?.off("calling:pick")
            socket?.off("calling:close")
            clearTimeout(delayClose)
        }
    }, [socket, calling, contact, status])

    useEffect(() => {
        if(status !== "incoming")
            return
        const timeNotif = setTimeout(() => {
            socket?.emit("calling:close", "unanswer", calling.contact?.username, (err?: string) => {
                if (err) {
                    notifAlert({
                        card: "alert",
                        type: "error",
                        message: err
                    })
                }
                setCalling({
                    contact: null,
                    status: "idle",
                    room_code: ""
                })
                setStatus("idle")
            })
        }, 15000);

        return () => {
            clearTimeout(timeNotif);
        }
    }, [status, calling])
    

    return (
        <Context.Provider value={{
            calling: calling,
            status: status,
            recorder: recorder,
            fn: {
                handleStatus,
                handleCalling,
                handlePick,
                handleClose,
                startCalling: createCalling
            }
        }}>
            {
                status === "incoming" && <CallingAlert />
            }
            {children}
        </Context.Provider>
    )
}

export default CallingMessageContext