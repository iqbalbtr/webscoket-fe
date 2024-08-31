import { useRouterMessage } from '@contexts/chat/message/RouterMessageContext'
import { ReactNode } from 'react'

export default function MessageContentLayout({ children }: { children: ReactNode }) {
    const { content } = useRouterMessage()
    return (
        <div className={`text-white animate-slide-right ${content.length >= 2 ? "block fixed z-10" : "hidden"} md:relative md:block bg-bg-secondary mb-16 h-fit w-full md:w-[640px] overflow-hidden border-l-2 border-bg-primary`}>
            {children}
        </div>
    )
}
