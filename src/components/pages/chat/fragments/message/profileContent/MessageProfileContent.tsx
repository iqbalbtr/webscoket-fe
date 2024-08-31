import React, { useCallback, useState } from 'react'
import EditProfileMessage from './chiild/EditProfileMessage';
import EditGroupMessage from './chiild/EditGroupMessafe';
import SwitchLayout from '@components/layouts/SwitchLayout';
import ProfileContent from './components/ProfileContent';
import MemberProfile from './components/MemberProfile';
import { GroupContact } from '@contexts/chat/ChatContext';

export type RouteMessageProfile = "idle" | "contact" | "group" | "edit_group" | "profile_member" | "back"

function MessageProfileContent() {

    const [route, setRoute] = React.useState<RouteMessageProfile[]>(["idle"]);
    const [member, setMember] = useState<GroupContact | undefined>(undefined)

    const handleRouterMessage = React.useCallback((name: RouteMessageProfile) => {
        setRoute(pv =>
            name === "back" ?
                pv.slice(0, -1) :
                pv.includes(name) ?
                    [...pv.filter(route => route !== name), name] :
                    [...pv, name]
        )
    }, [route]);

    const handleMember = useCallback((data: GroupContact) => {
        setMember(data)
    }, [route])
    

    return (
        <SwitchLayout<RouteMessageProfile>
            name={route}
            data={[
                {
                    name: "contact",
                    children: <EditProfileMessage handleRoute={handleRouterMessage} />
                },
                {
                    name: "group",
                    children: <EditGroupMessage handleRoute={handleRouterMessage} />
                },
                {
                    name: "idle",
                    children: <ProfileContent handleRoute={handleRouterMessage} handleMember={handleMember} />

                },
                {
                    name: "edit_group",
                    children: <EditGroupMessage handleRoute={handleRouterMessage} />
                },
                {
                    name: "profile_member",
                    children: <MemberProfile member={member} handleRoute={handleRouterMessage} />
                }
            ]}
        />
    )
}

export default MessageProfileContent
