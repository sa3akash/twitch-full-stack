'use client'

import { Icon } from '@/components/images/icon'
import { useAuth } from '@/hooks/useAuth'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import React from 'react'
import HeaderDropdown from './HeaderDropdown'

const HeaderRight = () => {

  const t = useTranslations('layout.header.headerMenu')
  const {isAuthenticated} = useAuth()

  return (
    <div>
      {isAuthenticated ? (
        <div className='flex items-center gap-x-12 [&_svg]:shrink-0 [&_svg]:cursor-pointer'>
            <Icon.plusIconDark />
            <Icon.chatIcon />
          <div className='relative'>
            <Icon.notificationIconDark />
            <span className='absolute -right-3 -top-3 w-4 h-4 rounded-full bg-rose-400 text-sm shrink-0 flex items-center justify-center'>2</span>
          </div>

          <HeaderDropdown/>

        </div>
      ) : (
        <div className='flex items-center gap-x-12 [&_a]:text-sm/5 '>
          <Link href="/account/create">{t('register')}</Link>
          <Link href="/account/login">{t('login')}</Link>
        </div>
      )}
    </div>
  )
}

export default HeaderRight