import { useContact } from "@contexts/chat/ContactContext"
import ContactGrupCard from "../../../contact/NewGrupContent/components/ContactGrupCard";
import { useState } from "react";
import { ContactType, useChat } from "@contexts/chat/ChatContext";
import { useMessage } from "@contexts/chat/MessageContext";
import { useRouterMessage } from "@contexts/chat/message/RouterMessageContext";
import { Icon } from "../../../../../../../constants/icons";

function ShareContact() {

    const { contact } = useContact();
    const [share, setShare] = useState<ContactType[]>([]);
    const { current } = useChat();
    const { fn: { sendMessage } } = useMessage()
    const { fn: { handleModalMessage } } = useRouterMessage();
    const [loading, setLoading] = useState(false);

    function handelContact(con: ContactType) {
        setShare(pv =>
            pv.find(fo =>
                fo.username === con.username) ?
                pv.filter(fo => fo.username !== con.username) :
                [...pv, con]
        )
    }

    function handleSend() {
        setLoading(true)
        share.forEach(con => {
            sendMessage({
                input: `${current?.username!}%2f${current?.name}`,
                to: con.username,
                type: con.type,
                typeFile: "contact"
            }, (status) => {
                if (status) {
                    setShare(pv => pv.filter(fo => fo.username !== con.username))
                }
            })
        })
        setLoading(false);
        handleModalMessage("back")
    }

    return (
        <div>
            <div className="w-full pt-6 bg-bg-secondary">
                <div className="relative px-6">
                    <button className="absolute left-8 top-1/2 -translate-y-1/2">
                        <Icon name="arrow-left" />
                    </button>
                    <input type="text" className="p-1 pl-6 bg-bg-primary w-full rounded-md" />
                </div>
                <div className="flex flex-col pt-6 gap-6 text-white h-[65vh] overflow-y-scroll">
                    <h3 className="text-green-primary text-xl px-6">RECENTS CHAT</h3>
                    <div className="flex flex-col">
                        {
                            contact.filter(fo => fo.username !== current?.username).map(con => (
                                <div
                                    key={con.id}
                                    onClick={() => handelContact(con)}
                                    className={`${share.find(fo => fo.username === con.username) ? "bg-slate-400/50" : ""} px-6`}
                                >
                                    <ContactGrupCard data={con} />
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
            <div className="py-2 text-white flex justify-between items-center bg-bg-primary px-6">
                <p className="line-clamp-1 px-4 py-2">{share.map((text, i) => <span key={i}>{text.username}, </span>)}</p>
                <button disabled={loading} onClick={handleSend}>
                    <Icon name="arrow-right" size={35} color="#fff" classname="p-1 rounded-full bg-green-accent" />
                </button>
            </div>
        </div>
    )
}

export default ShareContact
