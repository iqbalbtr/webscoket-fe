import ContactContentLayout from '../ContactContentLayout'
import HeaderContactLayout from '../HeaderContactLayout'

function SettingContentContact() {
    return (
        <ContactContentLayout>
            <HeaderContactLayout
                label='Settings'
            />

            <div className='w-full flex flex-col pt-6 text-white min-h-[77vh]  justify-between'>
            </div>
        </ContactContentLayout>
    )
}

export default SettingContentContact
