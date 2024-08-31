import React, { ReactNode, useCallback } from "react"
import { ContactType } from "../ChatContext";
import { useContact } from "../ContactContext";

type ContextType = {
    search: SearchContactType,
    fn: {
        hanldeSearch: (name: string) => void;
        handleByRead: () => void;
    }
};

export type SearchContactType = {
    status: boolean,
    byRead: boolean,
    data: ContactType[]
}

const Context = React.createContext<ContextType>({
    search: {
        byRead: false,
        data: [],
        status: false
    },
    fn: {
        hanldeSearch: () => { },
        handleByRead: () => { }
    }
});

export function useSearchContact() {
    return React.useContext(Context);
}

export default function SearchContactContext({ children }: { children: ReactNode }) {

    const { contact } = useContact();

    const [search, setSearch] = React.useState<SearchContactType>({
        status: false,
        data: [],
        byRead: false
    });

    const handleSearch = React.useCallback((name: string) => {

        if (!name) return setSearch(pv => ({
            ...pv,
            status: false,
            data: []
        }))

        setSearch(pv => ({
            ...pv,
            status: true,
            data: contact.filter(con =>
                con.name.toLowerCase().includes(name.toLowerCase()) ||
                con.username.toLowerCase().includes(name.toLowerCase())
            )
        }))

    }, [contact]);


    const handleByRead = useCallback(() => {
        setSearch(pv => ({
            ...pv,
            status: false,
            byRead: !pv.byRead,
            data: !pv.byRead ?
                contact.sort((a, b) =>
                    b.last_info.unread - a.last_info.unread
                ) : []
        }))
    }, [search])

    return (
        <Context.Provider
            value={{
                search: search,
                fn: {
                    hanldeSearch: handleSearch,
                    handleByRead: handleByRead
                }
            }}
        >
            {children}
        </Context.Provider>
    )
}
