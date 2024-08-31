import { useSession } from '@providers/AuthProvider';
import { useSocket } from '@providers/SocketProvider';
import React, { useCallback, useState } from 'react'
import { MsgType, useChat } from './ChatContext';
import { useContact } from './ContactContext';
import RouterMessageContext from './message/RouterMessageContext';
import SelectMessageContext from './message/SelectMessageContext';
import PullMessageContext from './message/PullMessage.Context';
import SendFileContext from './message/SendFileContext';
import CallingMessageContext from './message/CallingMessageContext';
import SearchMessageContext from './message/SearchMessagteContext';
import EditMessageContext from './message/EditMessageContext';
import { useNotif } from '@contexts/NotificationContext';
import { SendingMsg } from '../../types/message.type';
import { callback } from '../../types/utils.type';
import SendAudioContext from './message/SendAudioContext';

type ContextType = {
    message: MsgType[],
    position: any,
    fn: {
        sendMessage: (payload: SendingMsg, callback: callback<MsgType>) => void;
        removeMessage: (msgId: string, callback: callback<MsgType>) => void;
        removeAllMessage: (contactId: string) => void;
        handleRetriveMessage: () => void
    }
}

const Context = React.createContext<ContextType>({
    message: [],
    position: {},
    fn: {
        sendMessage: () => { },
        removeMessage: () => { },
        removeAllMessage: () => { },
        handleRetriveMessage: () => { }
    }
});

export type MessageType = "group" | "private" | "idle"
export type MessageRouterActive = ["search", "user_info"]
export type ModalRouterMessageType = "forward" | "share" | "idle" | "back";
export const ModalRouterMessageActive = ["forward", "share"];

export function useMessage() {
    return React.useContext(Context)
}

function MessageContext({ children }: { children: React.ReactNode }) {

    const [message, setMessage] = React.useState<MsgType[]>([]);
    const [sending, setSending] = useState<MsgType[]>([]);
    const { user: { username } } = useSession();
    const { current } = useChat();
    const { socket } = useSocket();
    const { contact, fn: { storeLastInfoUser, storeLastInfoCurrent, storeLastInfoGroup } } = useContact();
    const { notifAlert } = useNotif()
    const [position, setPosition] = useState({
        page: 0,
        count: 0
    })

    const handleMessagePosition = useCallback(() => {

        if (position.count > position.page) {
            socket?.emit("chat:get", { username: current?.username, type: current?.type, page: 2 })
        }
    }, [position, message, current, socket])

    const handleCallbackMessage = useCallback((msg: MsgType) => {
        setSending(pv => pv.filter(fo => fo.time !== msg.time))
        if (msg.info_msg.to === current?.username) {

            /**
             * 
             * if message is edit
             */
            if (msg.info_msg.type === "edit") {
                return setMessage(pv =>
                    pv.map(foo =>
                        foo.id === msg.id ?
                            msg : foo
                    )
                )
            }

            setMessage(pv => pv.map(fo => {
                if (fo.time === msg.time) {
                    return msg;
                } else {
                    return fo
                }
            }))
        }
        storeLastInfoCurrent(msg)
    }, [socket, sending, message])

    const storeMessage = useCallback((msg: MsgType, group?: string) => {

        if (msg.info_msg.type === "private") {
            if (msg.info_msg.from === current?.username) {
                socket?.emit("message:readed", { current: current.id, type: current.type }, (err: string) => {
                    if (err) {
                        notifAlert({
                            card: "alert",
                            message: err,
                            type: "error",
                        })
                    }
                })
                storeLastInfoUser(msg, false)
                setMessage(pv => [...pv, msg]);
            } else {
                storeLastInfoUser(msg, true)
                notifAlert({
                    card: "user",
                    message: msg.msg,
                    type: "user",
                    title: "@" + msg.info_msg.from,
                })
            }
        } else {
            if (!group) return
            if (group === current?.username) {
                socket?.emit("message:readed", { current: current.id, type: current.type }, (err: string) => {
                    if (err) {
                        notifAlert({
                            card: "alert",
                            message: err,
                            type: "error",
                        })
                    }
                })
                storeLastInfoGroup(msg, false, group)
                setMessage(pv => [...pv, msg]);
            } else {
                storeLastInfoGroup(msg, true, group)
            }
        }

    }, [current, socket, contact])

    const sendMessage = ({
        input,
        to,
        type,
        pull,
        fwd,
        file,
        typeFile,
        src,
        idEdit
    }:
        SendingMsg,
        callback: callback<MsgType>
    ) => {

        // if user isn't pick contact
        if (!current) return callback("err");
        if (!input && !file) return callback("err");
        if (!socket) return callback("err")


        const payload: MsgType = {
            msg: input,
            time: Date.now(),
            forward: fwd ? true : false,
            type: typeFile || "idle",
            src: src || "",
            info_msg: {
                to: to,
                from: username!,
                respon_read: false,
                sender_read: true,
                read: true,
                type: type,
            },
            pull_msg_id: pull
        }

        // send message using socket
        if (type === "private") {
            socket.emit("message:private", payload, file, (err: string, res: MsgType) => {
                if (!err) {
                    handleCallbackMessage(res)
                }
            });
        } else if (type === "edit") {
            socket.emit("message:edit", idEdit, payload.msg, (err: string, res: MsgType) => {
                if (!err) {
                    handleCallbackMessage(res)
                }
            })
        } else {
            socket.emit("message:group", payload, payload.info_msg.to, file, (err: string, res: MsgType) => {
                if (!err) {
                    handleCallbackMessage(res)
                }
            });
        }

        setSending(pv => [...pv, payload])

        if (payload.info_msg.to === current.username) {
            if (type === "edit") {
                return setMessage(pv =>
                    pv.map(foo =>
                        foo.id === idEdit ?
                            {
                                ...foo,
                                msg: input,
                                info_msg: {
                                    ...foo.info_msg,
                                    type: "edit"
                                },
                                time: Date.now()
                            } :
                            foo
                    )
                )
            }

            setMessage(fo => [...fo, payload])
        }



        if (fwd) {
            socket?.emit("message:readed", { current: current.id, type: current.type }, (err: string) => {
                if (!err) {
                    notifAlert({
                        card: "alert",
                        message: err,
                        type: "error",
                    })
                }
            })
        }

        callback("", payload);
    }

    const removeMessage = React.useCallback((id: string, callback: (err: string, result?: MsgType) => void) => {

        socket?.emit("message:remove", id, (err: string, result: MsgType) => {
            if (!err) {
                setMessage(pv => pv.map(foo => {
                    if (foo.id === id) {
                        return {
                            ...foo,
                            msg: "Pesan telah dihapus"
                        }
                    } else {
                        return foo
                    }
                }))
                callback("", result)
            } else {
                callback(err)
            }
        })

    }, [message]);

    const removeAllMessage = React.useCallback((conatctId: string) => {

        const find = contact.find(foo => foo.id === conatctId)

        if (find?.type === "group")
            return

        socket?.emit("message:remove-all", conatctId, (err: string) => {
            if (!err) {
                if (current?.id === conatctId) {
                    setMessage([])
                }
            }
        })

    }, [message, current]);


    React.useEffect(() => {
        if (current) {
            setMessage([])
            setPosition({
                count: 0,
                page: 0
            })
            socket?.emit("chat:get", { username: current.username, type: current.type, page: 1 });
            if (current.last_info.unread >= 1) {
                socket?.emit("message:readed", { current: current.id, type: current.type }, (err: string) => {
                    if (err) {
                        notifAlert({
                            card: "alert",
                            message: err,
                            type: "error",
                        })
                    }
                })
            }
        }
    }, [current, socket])

    React.useEffect(() => {
        if (username && socket) {
            socket.on("message:private", (msg: MsgType) => {
                storeMessage(msg);
            });
            socket.on("message:resend", (msg: MsgType) => {
                storeMessage(msg);
            })
            socket.on("chat:get", (chat: MsgType[], page: number, count: number) => {

                setPosition(pv => ({ ...pv, page: page, count: count }))

                const getSending: MsgType[] = sending
                    .filter(fo => fo.info_msg.to === current?.username)
                    .map(fo => ({ ...fo, id: Math.ceil(Math.random() * 4000).toString() }));

                const payload = chat.reverse();
                setMessage(pv => [...payload, ...pv, ...getSending])
            })
            socket.on("message:group", (msg: MsgType, group: string) => {
                storeMessage(msg, group);
            })
        }
        return () => {
            if (socket) {
                socket.off("message:private");
                socket.off("message:resend");
                socket.off("chat:get");
                socket.off("message:group");
            }
        }
    }, [username, socket, current, position])

    return (
        <Context.Provider value={{
            position: position,
            message: message,
            fn: {
                sendMessage: sendMessage,
                removeMessage: removeMessage,
                removeAllMessage: removeAllMessage,
                handleRetriveMessage: handleMessagePosition
            }
        }}>
            <RouterMessageContext>
                <SelectMessageContext>
                    <SendAudioContext>
                        <PullMessageContext>
                            <CallingMessageContext>
                                <SearchMessageContext>
                                    <SendFileContext>
                                        <EditMessageContext>
                                            {children}
                                        </EditMessageContext>
                                    </SendFileContext>
                                </SearchMessageContext>
                            </CallingMessageContext>
                        </PullMessageContext>
                    </SendAudioContext>
                </SelectMessageContext>
            </RouterMessageContext>
        </Context.Provider>
    )
}

export default MessageContext
