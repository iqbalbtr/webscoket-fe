import { useContact } from "@contexts/chat/ContactContext"
import ContactContentLayout from "../ContactContentLayout"
import HeaderContactLayout from "../HeaderContactLayout"
import FieldNewContact from "./FieldNewContact"
import { useRef, useState } from "react"
import { useRouterContact } from "@contexts/chat/contact/RouterContactContext"
import { useNotif } from "@contexts/NotificationContext"
import { Icon } from "../../../../../../constants/icons"

function NewContactContent() {

    const { fn: { addContact } } = useContact()
    const { fn: { handleContent } } = useRouterContact()
    const ref = useRef<HTMLFormElement | null>(null);
    const [isLoading, setLoading] = useState(false)
    const { notifAlert } = useNotif()

    async function handleAddContact(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.preventDefault()
        if (!ref.current) return
        const form = new FormData(ref.current);

        const first_name = form.get("first_name") as string
        const last_name = form.get("last_name") as string
        const username = form.get("username") as string

        if (!first_name || !username)
            return notifAlert({
                card: "alert",
                message: "Incomplete data",
                type: "error"
            })

        setLoading(true)
        await addContact({
            first_name: first_name,
            last_name: last_name,
            username: username
        }, (err) => {
            if (!err) {
                handleContent("idle")
            }
        })

        setLoading(false)
    }

    return (
        <ContactContentLayout>
            <HeaderContactLayout
                label='New Contact'
            />

            <form ref={ref}>
                <div className="flex flex-col gap-2 px-10 py-8 text-white">
                    <div className="flex flex-col items-start gap-2 py-1">
                        <h2 className="text-sm">First name</h2>
                        <FieldNewContact name="first_name" />
                    </div>
                    <div className="flex flex-col items-start gap-2 py-1">
                        <h2 className="text-sm">Last name</h2>
                        <FieldNewContact name="last_name" />
                    </div>
                    <div className="flex flex-col items-start gap-2 py-1 mt-6">
                        <h2 className="text-sm">Username</h2>
                        <FieldNewContact name="username" />
                    </div>
                </div>

                <div className="py-12 flex justify-center">
                    <button
                    disabled={isLoading}
                        type="submit"
                        onClick={(e) => handleAddContact(e)}
                    >
                        <Icon name={isLoading ? "spiner" : "check"} size={55} classname={`p-2 rounded-full ${isLoading && "animate-spin"} bg-green-primary`} />
                    </button>
                </div>
            </form>
        </ContactContentLayout>
    )
}

export default NewContactContent
