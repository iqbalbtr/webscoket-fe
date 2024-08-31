// import React from 'react'
import SwitchLayout from "@components/layouts/SwitchLayout";
import _contact_dummy from "../../assets/json/contact.json"
import MainContentContaxt from './fragments/contact/mainContent/MainContentContaxt';
import NewGrupContentContact from "./fragments/contact/NewGrupContent/NewGrupContentContact";
import SettingContentContact from "./fragments/contact/settingContent/SettingContentContact";
import NewMessage from "./fragments/contact/newMessage/NewMessage";
import NewContactContent from "./fragments/contact/newContact/NewContactContent";
import { RouterContactType, useRouterContact } from "@contexts/chat/contact/RouterContactContext";
import ProfileContent from "./fragments/contact/profileContent/ProfileContent";
import ArchiveContactConten from "./fragments/contact/archiveContent/ArchiveContactConten";


function ContactContainer() {

    const { content } = useRouterContact()

    return (
        <section className="w-full z-0 md:w-[45%] lg:max-w-[45%] relative bg-bg-secondary border-bg-primary border-2">

            {/* Contact Section main contnt */}
            <MainContentContaxt />
            {/* Contact Section main contnt */}

            <SwitchLayout<RouterContactType>
                name={content}
                data={[
                    {
                        name: "group",
                        children: <NewGrupContentContact />
                    },
                    {
                        name: "settings",
                        children: <SettingContentContact />
                    },
                    {
                        name: "new_message",
                        children: <NewMessage />
                    },
                    {
                        name: "new_contact",
                        children: <NewContactContent/>
                    },
                    {
                        name: "archive",
                        children: <ArchiveContactConten/>
                    },
                    {
                        name: "profile",
                        children: <ProfileContent />
                    },
                ]}
            />

        </section>
    )
}

export default ContactContainer
