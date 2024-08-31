import { Link } from 'react-router-dom'
import { useSession } from '@providers/AuthProvider'

function Landing() {
  const { status } = useSession();
  return (
    <section className="bg-white h-full md:pt-24 dark:bg-gray-900">
      <div className="grid max-w-screen-xl px-4 pt-20 pb-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12 lg:pt-28">
        <div className="mr-auto place-self-center lg:col-span-7">
          <h1
            className="max-w-2xl mb-4 text-4xl font-extrabold leading-none tracking-tight md:text-5xl xl:text-6xl dark:text-white">
            Building digital <br />products & brands.</h1>
          <p className="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">This
            free and open-source landing page template was built using the utility classes from <a
              href="#" target="_blank" className="hover:underline">Tailwind CSS</a> and based on the
            components from the <a href="#/"
              className="hover:underline" target="_blank">Flowbite Library</a> and the <a href="https://flowbite.com/blocks/" target="_blank"
                className="hover:underline" >Blocks System</a>.</p>
          <div className="space-y-4 sm:flex sm:space-y-0 sm:space-x-4">
            <Link
              className="inline-flex items-center justify-center w-full px-24 py-3 text-sm font-medium text-center text-gray-900 border rounded-full border-gray-200 sm:w-auto hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
              to={status === "Authorized" ? "/chat" : "/auth/login"}
            >
              Masuk
            </Link>
          </div>
        </div>
        <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">
          <img src="https://demo.themesberg.com/landwind/images/hero.png" alt="hero image" />
        </div>
      </div>
    </section >

  )
}
{/*  */ }

export default Landing
