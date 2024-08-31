import HeaderContactLayout from '../HeaderContactLayout'
import { useSession } from '@providers/AuthProvider'
import ProfileInputField from './ProfilleInputFile';
import ContactContentLayout from '../ContactContentLayout';
import { useEffect, useState } from 'react';
import ImageCropInput from './ImageCropInput';
import { Icon } from '../../../../../../constants/icons';

const ProfileContent = () => {

  const [data, setData] = useState({
    first_name: "",
    last_name: "",
    bio: ""
  })
  const [loading, setLoading] = useState(false);
  const { user, updateUser } = useSession();
  const [profile, setProfile] = useState<{
    file?: Blob,
    url: string
  }>({
    file: undefined,
    url: ""
  })
  const [tgl, setTgl] = useState(false)


  async function handleSubmit() {
    setLoading(true)
    try {
      await updateUser(data, profile?.file!);
    } catch (error) {
      console.log(error);

    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setData({
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      bio: user.bio || ""
    })
    setProfile({
      url: user.profile ?? ""
    })
  }, [user])

  return (
    <ContactContentLayout>
      <HeaderContactLayout
        label='Profile'
      />
      <div className='flex flex-col items px-10 text-white'>

        {
          !tgl ? (
            <div className='relative self-center my-12'>
              <input type="file" className='opacity-0 absolute top-0 left-0 bottom-0 right-0' onChange={(e) => {
                if (e.target.files?.length) {
                  setProfile({
                    url: URL.createObjectURL(e.target.files[0])
                  })
                  setTgl(!tgl)
                }
              }} />
              {
                profile.url ? (
                  <img className='text-white w-[200px] flex justify-center items-center aspect-square rounded-full bg-gray-500' src={profile.url} alt="profile.jpg" />
                ) : (
                  <span className='text-7xl text-white w-[200px] flex justify-center items-center aspect-square rounded-full bg-gray-500'>{user.username?.charAt(0) || "@"}</span>
                )
              }
              <Icon name='pen' size={35} classname='absolute bottom-[5%] right-[5%] bg-green-primary p-2 rounded-full' />
            </div>
          ) : (
            <ImageCropInput data={profile} setTgl={setTgl} setHandle={setProfile} />
          )
        }


        {/* Profile Photo end */}

        <div className='flex flex-col gap-3'>
          <h3 className='text-green-primary'>First name</h3>
          <ProfileInputField
            action={(e) => setData(pv => ({ ...pv, first_name: e.target.value }))}
            value={data.first_name || ""}
            placeholder='Jhon'
          />
          <p className='pt-2 text-icon-color'>This is not your username or PIN.</p>
        </div>

        <div className='flex flex-col gap-3 mt-12'>
          <h3 className='text-green-primary'>Last name</h3>
          <ProfileInputField
            action={(e) => setData(pv => ({ ...pv, last_name: e.target.value }))}
            value={data.last_name || ""}
            placeholder='dea'
          />
        </div>
        <div className='flex flex-col gap-3 mt-12'>
          <h3 className='text-green-primary'>Bio</h3>
          <ProfileInputField
            action={(e) => setData(pv => ({ ...pv, bio: e.target.value }))}
            value={data.bio || ""}
            placeholder='-'
          />
        </div>

        <div className='w-full flex justify-center mt-12'>
          <button
            disabled={loading}
            onClick={handleSubmit}
            className={`p-2 rounded-full bg-green-primary ${loading && "animate-spin"} w-fit`}>
            <Icon size={35} name={loading ? "spiner" : 'check'} />
          </button>
        </div>
      </div>
    </ContactContentLayout>
  )
}

export default ProfileContent
