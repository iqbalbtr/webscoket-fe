import { MsgType, useChat } from '@contexts/chat/ChatContext'
import { useContact } from '@contexts/chat/ContactContext';
import { Icon } from '../../../../../constants/icons';

function ContactInfoCard({ data }: { data: MsgType }) {

    const { contact, fn: { addContact } } = useContact()
    const { fn: { handleCurrent } } = useChat()
    const parse = data.msg.split("%2f");
    const name = parse[1] ? parse[1].split("%2f") : `@${parse[0]}`
    const isExist = contact.find(fo => fo.username === parse[0]);

    async function handelChat(isHandle: boolean = false) {
        if(!parse.length) 
            return

        if(isExist) 
            return handleCurrent(isExist, isExist.type)

        await addContact({
            username: parse[0],
            first_name: Array.isArray(name) ? name[0] : "",
            last_name: Array.isArray(name) ? name[1] : ""
        }, (err, result) => {
            console.log(err);
            if(isHandle) {
                handleCurrent(result!, "private")
            }
        })

    }

    return (
        <div className='w-full p-6 bg-transparent justify-center items-center gap-1 rounded-md flex flex-col'>
            <span className='w-[80px] flex text-white text-4xl justify-center items-center aspect-square bg-slate-400 rounded-full'>{name[0].charAt(0)}</span>
            <h3 className='text font-semibold'>{isExist?.name.split("%2f").join(` `)}</h3>
            <span className='text-md text-icon-color mb-2'>@{parse[0]}</span>
            <div className='w-full flex justify-start gap-3'>
                <button className='py-1  px-3 bg-green-secondary rounded-md text-black' onClick={() => handelChat()}>
                    <Icon name='user-plus' />
                </button>
                <button className='py-1  px-3 bg-green-secondary rounded-md text-black' onClick={() => handelChat(true)}>
                    <Icon name='chat' />
                </button>
            </div>
        </div>
    )
}

export default ContactInfoCard