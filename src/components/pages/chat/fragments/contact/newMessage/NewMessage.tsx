import HeaderContactLayout from '../HeaderContactLayout';
import { useContact } from '@contexts/chat/ContactContext';
import ContactGrupCard from '../NewGrupContent/components/ContactGrupCard';
import { useRouterContact } from '@contexts/chat/contact/RouterContactContext';
import ContactContentLayout from '../ContactContentLayout';
import { useChat } from '@contexts/chat/ChatContext';

function NewMessage() {

    const { contact } = useContact()
    const { fn: { handleCurrent } } = useChat()
    const { fn: { handleContent } } = useRouterContact();

    return (
        <ContactContentLayout>
            <HeaderContactLayout
                label='New Chat'
            />

            <div className='w-full flex flex-col pt-6 text-white min-h-[77vh]  justify-between'>

                <div className='flex flex-col overflow-hidden'>

                    <div className='px-8 pb-6'>
                        <input type="text" className='w-full rounded-md bg-hover-color px-4 py-1  outline-none' placeholder='Seacrch name' />
                    </div>

                    <div className='py-6 px-8'>
                        <div>
                            <button
                                onClick={() => handleContent("group")}
                            >New Group</button>
                        </div>
                    </div>

                    <div className={`flex flex-col gap-4 px-8 max-h-[55vh] overflow-y-scroll`}>
                        {
                            contact.sort((a, b) => b.username.localeCompare(a.username)).map(data => (
                                <div key={data.id} onClick={() => handleCurrent(data, data.type)}>
                                    <ContactGrupCard data={data} />
                                </div>
                            ))
                        }
                    </div>

                </div>

            </div>
        </ContactContentLayout>
    )
}

export default NewMessage
