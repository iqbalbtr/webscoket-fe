import { useSocket } from "@providers/SocketProvider";
import React, { ReactNode, useEffect, useState } from "react"
import { useContact } from "../ContactContext";
import { useRouterContact } from "./RouterContactContext";
import { useChat } from "../ChatContext";

export type NewGroupType = {
    name: string,
    bio: string;
    member: {
        role?: number,
        username: string
    }[]
}

export type EditGroupProp = {
    group_code: string;
    name: string;
    bio?: string
}

export type GroupMember = {
    role: string;
    user: {
        id: string;
        username: string;
        email: string;
        user_info: {
            first_name: string
            last_name: string;
            bio: string;
        }
    }
}

type ContextType = {
    group: any[],
    loading: boolean,
    fn: {
        handleNewGroup: (payload: NewGroupType) => void;
        handleEditGroup: (payload: EditGroupProp) => void;
        handleRoleGroup: (code: string, member_id: string, role: number) => void;
        handleLeaveMember: (code: string, member_id: string) => void;
        handleDisbandGroup: (code: string) => void
    }
};

const Context = React.createContext<ContextType>({
    group: [],
    loading: false,
    fn: {
        handleNewGroup: () => { },
        handleEditGroup: () => { },
        handleDisbandGroup: () => { },
        handleLeaveMember: () => { },
        handleRoleGroup: () => { }
    }
});

export function useGroupContact() {
    return React.useContext(Context);
}


export default function GroupContactContext({ children }: { children: ReactNode }) {


    const { socket } = useSocket()
    const [isLoading, setLoading] = useState(false)
    const { group, fn: { addGroup }, hook: { setContact, setGroup } } = useContact()
    const { fn: { handleContent } } = useRouterContact();
    const { current, fn: { handleReset } } = useChat()

    const handleNewGroup = React.useCallback((payload: NewGroupType) => {
        setLoading(true)
        socket?.emit("group-create", payload, (err: string, result: any) => {
            if (result) {
                addGroup(result)
            }
            if (err || result)
                setLoading(false)
            handleContent("idle");
        })

    }, [socket, group]);

    const handleEdit = React.useCallback((payload: EditGroupProp) => {
        setGroup(pv =>
            pv.map(fo =>
                fo.group_code === payload.group_code ?
                    {
                        ...fo,
                        name: payload.name,
                        bio: payload.bio!
                    } : fo
            )
        )

        setContact(pv =>
            pv.map(fo =>
                fo.username === payload.group_code ?
                    {
                        ...fo,
                        name: payload.name,
                        bio: payload.bio!
                    } : fo
            )
        )

    }, [socket, group]);

    const handleLeaveMember = React.useCallback((code: string, member_id: string) => {
        setGroup(pv => pv.map(fo =>
            fo.group_code == code ? {
                ...fo,
                member: fo.member.filter(fi => fi.id !== member_id)
            } : fo
        ))
    }, [socket, group]);

    const handleRole = React.useCallback((code: string, member_id: string, role: number) => {
        setGroup(pv => pv.map(fo =>
            fo.group_code == code ? {
                ...fo,
                member: fo.member.map(fi =>
                    fi.id === member_id ?
                        {
                            ...fi,
                            role: role
                        } : fi
                )
            } : fo
        ))
    }, [socket, group]);

    const handleDisband = React.useCallback((code: string) => {                
        if (current?.username === code) {
            handleReset()
        }
        setGroup(pv => pv.filter(fo => fo.group_code !== code))
        setContact(pv => pv.filter(fo => fo.username !== code))
    }, [socket, group, current]);

    useEffect(() => {
        socket?.on("group-join", res => {
            addGroup(res)
        })
        socket?.on("group-edit", res => {
            console.log(res);
            
            handleEdit(res)
        })
        socket?.on("group-kick", res => {
            console.log(res);
            
            handleLeaveMember(res.group_code, res.member_id)
        })
        socket?.on("group-disband", res => {
            console.log(res);
            
            handleDisband(res.group_code)
        })
        socket?.on("group-role", res => {
            console.log("role =>",res);
            
            handleRole(res.group_code, res.member_id, res.role)
        })

        return () => {
            socket?.off("group-join")
            socket?.off("group-edit")
            socket?.off("group-kick")
            socket?.off("group-disband")
            socket?.off("group-role")
        }
    }, [socket, group])

    return (
        <Context.Provider
            value={{
                group: [],
                loading: isLoading,
                fn: {
                    handleNewGroup: handleNewGroup,
                    handleEditGroup: handleEdit,
                    handleDisbandGroup: handleDisband,
                    handleRoleGroup: handleRole,
                    handleLeaveMember: handleLeaveMember
                }
            }}
        >
            {children}
        </Context.Provider>
    )
}

