import HeaderContactLayout from "../HeaderContactLayout"
import ContactCard from "../../cards/ContactCard";
import ContactContentLayout from "../ContactContentLayout";
// import { useArchive } from "@contexts/chat/contact/ArchiveContactContext";
import { useContact } from "@contexts/chat/ContactContext";

function ArchiveContactConten() {

    const { contact } = useContact()    

    return (
        <ContactContentLayout>
            <HeaderContactLayout
                label='Di Arsipkan'
            />

            <div className='w-full flex flex-col pt-6 text-white min-h-[77vh]  justify-between'>

                <div className='flex flex-col overflow-hidden'>

                    <div className={`flex flex-col gap-1 px-2 max-h-[55vh] overflow-y-scroll`}>
                        {
                            contact.filter(foo => foo.archive).sort((a, b) => a.username.localeCompare(b.username)).map(data => {
                                return (
                                    <ContactCard data={data} key={data.id} />
                                )
                            })
                        }
                    </div>

                </div>
            </div>
        </ContactContentLayout>
    )
}

export default ArchiveContactConten
