import React, { ReactNode, useEffect, useState } from "react";
import { ContactType } from "../ChatContext"
import { useContact } from "../ContactContext";
import privateApi from "@libs/axios";

type Context = {
    arcive: ContactType[];
    fn: {
        handleAdd: (contactId: string) => void;
        handleRemove: (contactId: string) => void;
    }
}

const Context = React.createContext<Context>({
    arcive: [],
    fn: {
        handleAdd: () => { },
        handleRemove: () => { }
    }
})

export function useArchive() {

    return React.useContext(Context);
}

export default function ArchiveContactContext({ children }: { children: ReactNode }) {

    const { contact } = useContact();
    const [list, setList] = useState<ContactType[]>(contact.filter(foo => foo.archive));

    async function handleAdd(contactId: string) {
        const find = contact.find(foo => foo.id === contactId);

        if (find) {
            try {
                const up = await privateApi.patch(`/api/contacts/${contactId}`);

                if (up.status === 200) {
                    setList([{ ...find, archive: true }, ...list])
                }
            } catch (error: any) {

            }
        }
    }

    async function handleRemove(contactId: string) {
        const find = list.find(foo => foo.id === contactId);

        if (find) {

            if (find) {
                try {
                    const up = await privateApi.delete(`/api/contacts/${contactId}`);

                    if (up.status === 200) {
                        setList(pv => pv.filter(foo => foo.id !== contactId))
                    }
                } catch (error: any) {

                }
            }
        }
    }


    useEffect(() => {
        for(const con of contact){
            setList(pv => contact.find(foo => foo.id === con.id) ? pv : [con, ...pv])
        }
    }, [contact])

    return (
        <Context.Provider
            value={{
                arcive: list,
                fn: {
                    handleAdd,
                    handleRemove
                }
            }}
        >
            {children}
        </Context.Provider>
    )
}
