import { ReactNode } from "react"

function ContactContentLayout({ children }: { children: ReactNode }) {
    return (
        <div className='absolute h-full overflow-y-scroll animate-slide-left overflow-hidden w-full left-0 top-0 bg-bg-secondary'>
            <div className=" h-screen">
                {children}
            </div>
        </div>
    )
}

export default ContactContentLayout
