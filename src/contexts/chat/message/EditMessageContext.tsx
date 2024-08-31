import React, { ReactNode, useState } from "react";
import { MsgType } from "../ChatContext";

type ContextType = {
    edit: MsgType | null;
    fn: {
        handleEditChange: (e: string) => void;
        handleEdit: (e: MsgType | null) => void;
    }
}

const Context = React.createContext<ContextType>({
    edit: null,
    fn: {
        handleEdit: () => { },
        handleEditChange: () => { }
    }
})

export const useEditMessage = () => React.useContext(Context);

function EditMessageContext({ children }: { children: ReactNode }) {

    const [edit, setEdit] = useState<MsgType | null>(null);

    function handleEdit(e: MsgType | null) {
        setEdit(e);
    }

    function handleEditChange(e: string) {
        if (!edit)
            return
        setEdit(pv => pv ? ({
            ...pv,
            msg: e
        }) : null)
    }

    return (
        <Context.Provider value={{
            edit: edit,
            fn: {
                handleEdit,
                handleEditChange
            }
        }}>
            {children}
        </Context.Provider>
    )
}

export default EditMessageContext
