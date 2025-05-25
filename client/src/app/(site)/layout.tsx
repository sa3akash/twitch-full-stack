import Header from '@/components/layout/header/Header'
import React, { PropsWithChildren } from 'react'

const SiteLayout = ({children}:PropsWithChildren) => {
  return (
    <div className='h-full'>
        <div className='h-full flex flex-col'>
          <div className="flex-1">
            <div className='fixed top-0 inset-y-0 z-50 h-[75px] w-full'>
              <Header />
            </div>
            <main className='mt-[75px]'>{children}</main>
          </div>
        </div>
    </div>
  )
}

export default SiteLayout