import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useSession } from '@providers/AuthProvider';
import { useNotif } from '@contexts/NotificationContext';

function RegisterForm() {
    const form = React.useRef<HTMLFormElement | null>(null);
    const { register, status } = useSession();
    const navigate = useNavigate();
    const { notifAlert } = useNotif()

    async function handleRegister(e: any) {

        e.preventDefault();
        const inputs = new FormData(form.current!);
        const user = inputs.get("username") as string;
        const email = inputs.get("email") as string;
        const pass = inputs.get("password") as string;

        if (!pass && !user) return;
        register({
            username: user,
            email: email,
            password: pass
        }, (err) => {
            if (err) {
                notifAlert({
                    card: "alert",
                    message: err,
                    type: "error"
                })
            } else {
                navigate("/auth/login")
            }
        })
    }

    return (
        <section className="w-full h-screen bg-bg-container">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div className="w-full bg-slate-100 rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Create your account
                        </h1>
                        <form ref={form} className="space-y-4 md:space-y-6" action="#">
                            <div>
                                <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">username</label>
                                <input type="text" name="username" id="username" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required />
                            </div>
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                                <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required />
                            </div>
                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                <input type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                            </div>

                            <button
                                onClick={handleRegister}
                                disabled={status === "loading"}
                                type="submit"
                                className="w-full text-white bg-green-accent hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                            >
                                {status === "loading" ? "Loading" : "Sign in"}
                            </button>
                            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                Don’t have an account yet? <a href="/auth/login" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign in</a>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default RegisterForm
