import { useSession } from '@providers/AuthProvider';
import Profile from '../../../cards/Profile';
import ContactMenuList from '../../../listMenu/ContactListMenu';
import ModalTransparent from '@components/core/ModalTransparent';
import { useRouterContact } from '@contexts/chat/contact/RouterContactContext';
import { Icon } from '../../../../../../../constants/icons';

function ContactHeader() {

    const { user } = useSession();
    const { fn: { handleContent, handleToggle } } = useRouterContact();

    return (
        <div className={`w-full flex justify-between h-[7%] px-4 bg-bg-primary relative`}>
            <button onClick={() => handleContent("profile")} className='flex gap-3 items-center'>
                <Profile username={user.username || ""} src={user.profile} width={40} />
                <h3 className='text-icon-color font-semibold text-md'>{user.first_name || `@${user.username}`}</h3>
            </button>
            <div
                className='relative flex gap-5 items-center'
            >
                <button onClick={() => handleContent("new_message")}>
                    <Icon size={30} name='comment-plus' />
                </button>
                <button onClick={() => handleContent("new_contact")}>
                    <Icon size={30} name='user-plus' />
                </button>
                <ModalTransparent
                    button={() => (
                        <div
                            onClick={() => handleToggle()}
                        >
                            <Icon name='elipsis' />
                        </div>
                    )}
                >
                    {(handleTgl) => (
                        <ContactMenuList handleTgl={handleTgl} />
                    )}
                </ModalTransparent>
            </div>
        </div>
    )
}

export default ContactHeader
