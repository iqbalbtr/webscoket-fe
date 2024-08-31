import React from 'react'

function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='p-2 bg-black h-screen w-full'>
      {children}
    </div>
  )
}

export default MainLayout
