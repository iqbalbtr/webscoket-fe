import useCookie from "@hooks/useCookie";
import React from "react"
import { useLocation, useNavigate } from "react-router-dom";
import { socket } from "../socket";
import privateApi from "@libs/axios";
import { useNotif } from "@contexts/NotificationContext";

type StatusProps = "Authorized" | "Unauthrorized" | "loading";
type UserProps = {
    id: string;
    username: string;
    first_name: string;
    last_name: string;
    profile?: string;
    bio: string
}
type ContextProps = {
    user: Partial<UserProps>;
    status: Partial<StatusProps>;
    login: (payload: PayloadProps) => Promise<void>;
    logout: () => Promise<void>;
    updateUser: (payload: Partial<UserProps>, profile: Blob | undefined) => Promise<void>,
    register: (payload: { username: string, email: string, password: string }, callback: (err: string) => void) => Promise<void>;
}
type PayloadProps = {
    username: string;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
}

const AuthContext = React.createContext<ContextProps>({
    user: {},
    status: "Unauthrorized",
    login: async () => { },
    logout: async () => { },
    updateUser: async () => { },
    register: async () => { }
});

export function useSession() {
    return React.useContext(AuthContext);
}

function AuthProvider({
    children
}: {
    children: React.ReactNode
}) {
    
    const [status, setStatus] = React.useState<Partial<StatusProps>>("loading");
    const [user, setUser] = React.useState<Partial<UserProps>>({});
    const [reCon, setReCon] = React.useState<boolean>(false);
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const { notifAlert } = useNotif()
    const _user = useCookie("_user");

    const login = React.useCallback(async (payload: PayloadProps) => {
        setStatus("loading");
        try {
            const res = await privateApi.post("/auth/login", payload, {
                withCredentials: true
            });

            if (res.status === 200) {
                /*
                * Reload for connectiong socket to server
                *
                */
                notifAlert({
                    card: "alert",
                    message: "Success Login",
                    type: "success"
                })
                navigate(-1)
                window.location.reload();
            }
        } catch (error: any) {
            notifAlert({
                card: "alert",
                message: error.message,
                type: "error"
            })
        } 
    }, [])
    

    const logout = React.useCallback(async () => {
        setStatus("loading")
        try {
            const response = await privateApi.patch("/auth/logout", {}, {
                withCredentials: true
            });

            if (response.status === 200) {
                notifAlert({
                    card: "alert",
                    message: "Success Logout",
                    type: "success"
                })
                setUser({});
                setStatus("Unauthrorized");
                navigate("/");
                socket.emit("log-out", user.username)
                socket.disconnect();
            }
        } catch (error: any) {
            notifAlert({
                card: "alert",
                message: error.message,
                type: "error"
            })
            setStatus("Unauthrorized");
        }
    }, []);

    const register = React.useCallback(async (payload: { username: string, email: string, password: string }, callback: (err: string) => void) => {
        setStatus("loading");
        try {
            await privateApi.post("/auth/register", payload);
            setStatus("Unauthrorized");
            setUser({});
            notifAlert({
                card: "alert",
                message: "User created",
                type: "success"
            })
            callback("")
        } catch (error: any) {
            notifAlert({
                card: "alert",
                message: error.message,
                type: "error"
            })
            callback(error.message)
            setStatus("Unauthrorized");
        }
    }, [])

    const me = React.useCallback(async () => {
        try {
            const req = await privateApi.get("/auth/me")

            if (req.status === 200) {
                setUser(req.data.result);
                setStatus("Authorized");
            }
        } catch (error: any) {
            setUser({});
            setStatus("Unauthrorized");
        }
    }, [])

    const updateUser = React.useCallback(async (payload: Partial<UserProps>, profile: Blob | undefined) => {
        try {
            if (!payload.first_name)
                return
            const update = await privateApi.patchForm(`/api/user`, {
                ...payload,
                ...(profile && {
                    profile: profile
                })
            });

            if (update.status === 200) {
                setUser(pv => ({ ...pv, ...update.data.result }))
                notifAlert({
                    card: "alert",
                    message: "User updated",
                    type: "success"
                })
            }
        } catch (error: any) {
            notifAlert({
                card: "alert",
                message: error.message,
                type: "error"
            })

        } finally {
        }
    }, [user])

    React.useEffect(() => {

        if (reCon)
            return;

        if (_user) {
            setUser(_user);
            setReCon(true);
        } else {
            me();
        }

    }, [_user])

    React.useEffect(() => {

        if (status === "loading") return
            if (status === "Unauthrorized") {

                if (pathname.startsWith("/chat")) {
                    navigate("/auth/login");
                    return;
                }
            } else {
                if (pathname.startsWith("/auth")) {
                    navigate("/");
                }
            }

    }, [pathname, status])

    console.log(status);
    

    React.useEffect(() => {
        socket.connect();
        socket.emit("login", user.username)
    }, [user.username, socket])


    return (
        <AuthContext.Provider value={{ status, user, login, logout, register, updateUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;