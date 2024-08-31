import React from "react";
import MessageContext from "./MessageContext";
import ContactContext from "./ContactContext";

export type UserContact = {
    id: string;
    first_name: string;
    last_name?: string;
    bio?: string;
    username: string;
    email: string;
}

export type GroupContact = {
    id: string;
    first_name: string;
    bio: string;
    username: string;
    role: number,
    profile?: string
}
export type LastInfo = {
    id: string,
    msg: string,
    time: Date | number,
    unread: number
}

export type GroupType = {
    id: string;
    name: string;
    bio: string;
    group_code: string;
    member: GroupContact[];
    last_info: LastInfo;
};

export type ContactType = {
    id: string;
    name: string;
    bio: string;
    profile: string;
    username: string;
    last_info: LastInfo;
    block: boolean;
    last_active: string;
    archive: boolean;
    unsaved: boolean;
    type: "private" | "group"
}

export type MsgType = {
    id?: string;
    msg: string;
    time: Date | number;
    forward: boolean;
    src?: string;
    type: "files" | "photo" | "video" | "contact" | "idle" | "audio";
    info_msg: {
        id?: string;
        to: string;
        from: string;
        respon_read: boolean;
        sender_read: boolean;
        read: boolean;
        type: "group" | "private" | "edit";
    },
    pull_msg_id?: string;
    pull_msg?: {
        id: string;
        msg: string;
        time: Date | number;
        src: string;
        type: "files" | "photo" | "video" | "idle" | "audio";
        forward: boolean;
        info_msg: {
            id?: string;
            to: string;
            from: string;
            respon_read: boolean;
            sender_read: boolean;
            read: boolean;
            type: "group" | "private" | "edit";
        }
    },

}

type ContextProps = {
    current: ContactType | null;
    chatType: ChatType;
    fn: {
        handleCurrent: (curr: ContactType, type: "private" | "group") => void;
        removeCurrent: () => void;
        handleReset: () => void;
    }
}

export type ChatType = "group" | "private" | "idle"
export type ChatRouterType = "search" | "user_info" | "modal_share" | "modal_forward" | "idle"
export type ChatRouterActive = ["search", "user_info", "modal_share", "modal_forward"]

const Context = React.createContext<ContextProps>({
    current: null,
    chatType: "idle",
    fn: {
        handleCurrent: () => { },
        removeCurrent: () => { },
        handleReset: () => { }
    }
})

export function useChat() {
    return React.useContext(Context);
}


function ChatContext({
    children
}: {
    children: React.ReactNode
}) {

    const [current, setCurrent] = React.useState<ContactType | null>(null);
    const [statusChat, setStatusChat] = React.useState<ChatType>("idle");

    // handle current user chat
    const handleCurrent = React.useCallback((curr: ContactType, type: "private" | "group") => {
        setCurrent(curr);
        setStatusChat(type)
    }, [current, statusChat]);

    const handleReset = React.useCallback(() => {
        setCurrent(null);
        setStatusChat("idle")
    }, [current, statusChat]);

    const removeCurrent = React.useCallback(() => {
        setCurrent(null);
        setStatusChat("idle")
    }, [current, statusChat]);

    return (
        <Context.Provider value={{
            chatType: statusChat,
            current: current,
            fn: {
                handleCurrent: handleCurrent,
                removeCurrent: removeCurrent,
                handleReset
            }
        }}>
            <ContactContext>
                <MessageContext>
                    {children}
                </MessageContext>
            </ContactContext>
        </Context.Provider>
    )
}

export default ChatContext