import React, { ReactNode, useCallback, useContext, useState } from 'react';
import NotifCard from '@components/pages/chat/fragments/cards/NotiCard';

export type NotifType = {
    id?: number;
    message: string;
    card: "user";
    type?: "user";
    title?: string;
    btntitle?: string;
    onSuccess?: () => void;
    onReject?: () => void;
} | {
    id?: number;
    message: string;
    type?: "error" | "success" | "alert";
    card: "alert";
    title?: string;
    btntitle?: string;
    onSuccess?: () => void;
    onReject?: () => void;
};

type ContextType = {
    notifAlert: (ops: NotifType) => void;
};

const Context = React.createContext<ContextType>({
    notifAlert: () => { },
});

export function useNotif() {
    return useContext(Context);
}

function NotificationContext({ children }: { children: ReactNode }) {
    const [notif, setNotif] = useState<NotifType[]>([]);

    const createNotif = useCallback((ops: NotifType) => {
        const payload: NotifType = {
            ...ops,
            id: Math.floor(Math.random() * 1000),
        };

        setNotif(prevNotif => [...prevNotif, payload]);

        setTimeout(() => {
            setNotif(prevNotif =>
                prevNotif.filter(notification => notification.id !== payload.id)
            );
        }, 3500);
    }, [notif])

    const handleDelete = useCallback((id: number) => {
        const current = notif.find(fo => fo.id === id);
        current?.onReject && current.onReject()
        setNotif(prevNotif =>
            prevNotif.filter(notification => notification.id !== id)
        );
    }, [notif])

    return (
        <Context.Provider value={{ notifAlert: createNotif }}>
            <div className='relative'>
                <div className='absolute overflow-hidden bottom-24 right-12 gap-3 h-auto w-auto z-[99999] flex flex-col justify-end'>
                    {notif.map(notification => (
                        <NotifCard key={notification.id} data={notification} handle={handleDelete} />
                    ))}
                </div>
                {children}
            </div>
        </Context.Provider>
    );
}

export default NotificationContext;