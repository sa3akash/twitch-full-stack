import React from 'react'
import Discover from './Discover'
import Search from './Search'
import HeaderRight from './HeaderRight'

const Header = () => {
  return (
    <header className='h-full flex items-center gap-x-4 border-b-[2px] border-border bg-card px-16 justify-between'>
      <Discover />
      <Search />
      <HeaderRight />
    </header>
  )
}

export default Header