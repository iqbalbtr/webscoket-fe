import React, { Dispatch, SetStateAction, useCallback } from "react"
import { Loading } from "@hooks/useFetch";
import { ContactType, GroupType, MsgType, useChat } from "./ChatContext";
import { useSocket } from "@providers/SocketProvider";
import RouterContactContext, { useRouterContact } from "./contact/RouterContactContext";
import SearchContactContext from "./contact/SearchContactContext";
import GroupContactContext from "./contact/GroupContactContext";
import privateApi from "@libs/axios";
import { useNotif } from "@contexts/NotificationContext";

type ContextType = {
    contact: ContactType[];
    group: GroupType[];
    error: string;
    fn: {
        addContact: (payload: { username: string, last_name: string, first_name: string }, callback: (err: string, result?: ContactType) => void) => Promise<void>,
        removeContact: (id: string, callback: (err: string, result?: string) => void) => Promise<void>;
        updateContact: (payload: { id: string, firstname: string, lastname: string }, callback: (err: string) => void) => Promise<void>;
        storeLastInfoUser: (msg: MsgType, unread: boolean) => void;
        storeLastInfoGroup: (msg: MsgType, unread: boolean, group: string) => void;
        storeLastInfoCurrent: (msg: MsgType) => void;
        getGroup: (code: string) => GroupType | null
        handleArchive: (type: boolean) => Promise<void>
        handleBlock: (type: boolean) => Promise<void>
        addGroup: (payload: GroupType) => void
    },
    hook: {
        setGroup: Dispatch<SetStateAction<GroupType[]>>,
        setContact: Dispatch<SetStateAction<ContactType[]>>
    }
};

const Context = React.createContext<ContextType>({
    contact: [],
    group: [],
    error: "",
    fn: {
        addContact: async () => { },
        removeContact: async () => { },
        updateContact: async () => { },
        storeLastInfoUser: () => { },
        storeLastInfoGroup: () => { },
        storeLastInfoCurrent: () => { },
        getGroup: () => null,
        handleArchive: async () => { },
        handleBlock: async () => { },
        addGroup: () => { }
    },
    hook: {
        setGroup: () => { },
        setContact: () => { }
    }
});

export function useContact() {
    return React.useContext(Context);
}
function ContactContext({ children }: { children: React.ReactNode }) {

    const socketProvider = useSocket();
    const { socket } = useSocket();
    const { notifAlert } = useNotif()
    const [list, setList] = React.useState<ContactType[]>([]);
    const [group, setGroup] = React.useState<GroupType[]>([]);
    const [status, setStatus] = React.useState<Loading>("idle");
    const [error, setError] = React.useState("");
    const { fn: { handleContent } } = useRouterContact()

    const { current } = useChat();


    const getContact = React.useCallback(async () => {
        setStatus("loading");
        const response = await fetch("http://localhost:8080/api/contacts", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include"
        });

        const res = await response.json();

        if (!response.ok) {
            setStatus("error");
            setError(res.error.message);
            throw new Error(res.error);
        } else {
            setStatus("success");
            setList(res.result.list)
            setGroup(res.result.group)
        }


    }, [list, status])

    const addGroup = React.useCallback(async (payload: GroupType) => {
        const res: ContactType = {
            id: payload.id,
            name: payload.name,
            bio: payload.bio,
            archive: false,
            block: false,
            last_active: Date.now().toString(),
            last_info: payload.last_info,
            profile: "",
            type: "group",
            unsaved: false,
            username: payload.group_code
        }
        setGroup([...group, payload])
        setList(pv => [res, ...pv])
        notifAlert({
            card: "alert",
            type: "success",
            message: "Success create"
        })
    }, [status, list, group])

    const addContact = React.useCallback(async (payload: { username: string, first_name: string, last_name: string }, cb: (err: string, result?: ContactType) => void) => {
        setStatus("loading");
        try {
            const req = await privateApi.post("/api/contacts", payload);

            if (req.status === 200) {
                setList(pv => [...pv, req.data.result])
                notifAlert({
                    card: "alert",
                    type: "success",
                    message: "Success create"
                })
                cb("", req.data.result as ContactType)
                handleContent("idle");
            }
        } catch (error: any) {
            setStatus('error')
            notifAlert({
                card: "alert",
                type: "error",
                message: error.message
            })
            cb(error.message)
        }
    }, [status, list])

    const removeContact = React.useCallback(async (id: string, cb: (err: string, result?: string) => void) => {
        setStatus("loading");
        try {
            const req = await privateApi.delete(`/api/contacts/${id}`);
            if (req.status === 200) {
                setList(pv => pv.filter(foo => foo.id !== id))
                setStatus('success');
                cb("", "Success")
            }
        } catch (error: any) {
            cb(error.message)
            setStatus('error')
        }
    }, [list, status]);

    const updateContact = React.useCallback(async (payload: { id: string, firstname: string, lastname?: string }, cb: (err: string) => void) => {
        setStatus("loading");
        try {
            const req = await privateApi.patch(`/api/contacts/${payload.id}`, payload);

            if (req.status === 200) {
                setList(pv => pv.map(foo => {
                    if (foo.username === req.data.result.username) {
                        return {
                            ...foo,
                            ...req.data.result
                        }
                    } else {
                        return foo
                    }
                }))
                setStatus('success');
                notifAlert({
                    card: "alert",
                    type: "success",
                    message: "Success update contact"
                })
                cb("")
            }
        } catch (error: any) {
            cb(error.message)
            notifAlert({
                card: "alert",
                type: "error",
                message: error.message
            })
            setStatus('error')
        }
    }, [list, status]);

    const storeLastInfoUser = React.useCallback((msg: MsgType, unread: boolean) => {

        setList(pv => pv.map(foo => {
            if (foo.username === msg.info_msg.from) {
                return {
                    ...foo,
                    last_info: {
                        ...foo.last_info,
                        unread: unread ? foo.last_info.unread + 1 : 0,
                        msg: msg.type === "contact" ? msg.msg.split("%2f")[0] : msg.msg,
                        time: msg.time
                    }
                }
            } else {
                return foo
            }
        }))
    }, [list, current, current]);

    const storeLastInfoCurrent = React.useCallback((msg: MsgType) => {
        setList(pv => pv.map(foo => {
            if (foo.username === msg.info_msg.to) {
                return {
                    ...foo,
                    last_info: {
                        ...foo.last_info,
                        unread: 0,
                        msg: msg.type === "contact" ? msg.msg.split("%2f")[0] : msg.msg,
                        time: msg.time
                    }
                }
            } else {
                return foo
            }
        }).sort((a, b) => new Date(b.last_info.time).getTime() - new Date(a.last_info.time).getTime())
        )
    }, [list, current?.id]);

    const handleArsip = useCallback(async (type: boolean) => {
        try {
            const up = type ? await privateApi.patch(`/api/contacts/archive/${current?.id}`)
                : await privateApi.delete(`/api/contacts/archive/${current?.id}`)

            if (up.status === 200) {
                setList(pv => pv.map(foo => {
                    if (foo.id === current?.id) {
                        return {
                            ...foo,
                            archive: type
                        }
                    } else {
                        return foo
                    }
                }))
                notifAlert({
                    card: "alert",
                    type: "success",
                    message: "Success " + (type ? "archived" : 'unarchived')
                })
            }
        } catch (error: any) {
            notifAlert({
                card: "alert",
                type: "error",
                message: error.message
            })
        }
    }, [current, list])

    const handleBlock = useCallback(async (type: boolean) => {
        console.log(type);

        try {
            const up = type ? await privateApi.patch(`/api/contacts/block/${current?.id}`)
                : await privateApi.delete(`/api/contacts/block/${current?.id}`)

            if (up.status === 200) {
                setList(pv => pv.map(foo => {
                    if (foo.id === current?.id) {
                        return {
                            ...foo,
                            block: type
                        }
                    } else {
                        return foo
                    }
                }))
                notifAlert({
                    card: "alert",
                    type: "success",
                    message: "Contact " + (type ? "blocked" : "unblocked")
                })
            }
        } catch (error: any) {
            notifAlert({
                card: "alert",
                type: "error",
                message: error.message
            })
        }
    }, [current, list])


    const storeLastInfoGroup = React.useCallback((msg: MsgType, unread: boolean, group: string) => {
        setList(pv => pv.map(foo => {
            if (foo.username === group) {
                return {
                    ...foo,
                    last_info: {
                        ...foo.last_info,
                        unread: unread ? foo.last_info.unread + 1 : 0,
                        msg: msg.msg,
                        time: msg.time
                    }
                }
            } else {
                return foo
            }
        }).sort((a, b) => new Date(b.last_info.time).getTime() - new Date(a.last_info.time).getTime())
        )
    }, [list, current?.id]);

    const getGroup = React.useCallback((code: string) => {

        const find = group.find(foo => foo.group_code === code);
        const result = find?.member.map(foo => {
            const exist = list.find(fi => fi.username === foo.username);
            if (exist) {
                return {
                    ...exist,
                    role: foo.role
                };
            } else {
                return foo
            }
        }) || []


        return {
            ...find,
            member: result
        } as GroupType
    }, [list, current?.id]);




    const updatelastActive = React.useCallback((type: "online" | "offline", current: any) => {
        setList(pv => pv.map(foo => {
            if (foo.username === current.username) {
                return {
                    ...foo,
                    last_active: type === "online" ? "online" : (new Date()).toString()
                }
            } else {
                return foo
            }
        }).sort((a, b) => new Date(b.last_info.time).getTime() - new Date(a.last_info.time).getTime())
        )
    }, [list, current?.id]);



    React.useEffect(() => {
        if (!socket) return
        if (socketProvider.status) {
            getContact()

            socket.on("user-online", (cur) => {
                updatelastActive("online", cur)

            })
            socket.on("user-offline", (cur) => {
                // upadte contact if user onine or disconnect
                updatelastActive("offline", cur)
            })
            socket.on("new-contact", (con: ContactType) => {
                setList(pv => [con, ...pv])
            })

            return () => {
                socket.off("user-status");
                socket.off("new-contact");
            }
        }
    }, [socketProvider.status]);

    React.useEffect(() => {
        if (current) {
            setList(pv => pv.map(foo => {
                if (foo.username === current.username) {
                    return {
                        ...foo,
                        last_info: {
                            ...foo.last_info,
                            unread: 0,
                        }
                    }
                } else {
                    return foo
                }
            }))
        }
    }, [current]);


    return (
        <Context.Provider value={{
            contact: list,
            group: group,
            error: error,
            fn: {
                addContact: addContact,
                removeContact: removeContact,
                updateContact: updateContact,
                storeLastInfoUser: storeLastInfoUser,
                storeLastInfoCurrent: storeLastInfoCurrent,
                storeLastInfoGroup: storeLastInfoGroup,
                getGroup: getGroup,
                handleArchive: handleArsip,
                handleBlock: handleBlock,
                addGroup: addGroup
            },
            hook: {
                setContact: setList,
                setGroup: setGroup
            }
        }}
        >
            <RouterContactContext>
                <GroupContactContext>
                    <SearchContactContext>
                        {children}
                    </SearchContactContext>
                </GroupContactContext>
            </RouterContactContext>
        </Context.Provider >
    )
}

export default ContactContext