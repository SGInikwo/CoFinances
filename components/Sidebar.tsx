'use client'

import { sidebarLinks } from '@/constants'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import Footer from './Footer'
import TransactionsInput from './TransactionsInput'

const Sidebar = ( {user}: SidebarProps ) => {
  const pathName = usePathname();

  return (
    <section className='sidebar bg-financeSidebar'>
      <nav className='flex flex-col gap-4'>
        <Link href='/' className='mb-12 cursor-pointer flex items-center gap-2'>
          <Image
            src='/icons/logo.svg'
            width={34}
            height={34}
            alt='CoFinance Logo'
            className='size-[36px] max-xl:size-14'
          />
          <h1 className='sidebar-logo'>CoFinance</h1>
        </Link>

        {sidebarLinks.map((item) => {
          const isActive = pathName === item.route || pathName.startsWith(`${item.route}/`);
          return (
            <Link 
              href={item.route} 
              key={item.label}
              className={cn('sidebar-link', {
                'bg-financeGradient': isActive
              })}
            >
              <div className='relative size-6'>
                <Image 
                  src={item.imgURL}
                  alt={item.label}
                  fill
                  className={cn('filter', {
                    'brightness-0 invert': isActive
                  })}
                />
              </div>
              <p className={cn("sidebar-label w-full h-full", { "!text-white": isActive }, {'hover:text-financeGradient': !isActive})}>
                {item.label}
              </p>  
            </Link>
          )
        })}
      </nav>
      <div>
        <TransactionsInput />
        <Footer user={user} />
      </div>
      
    </section>
  )
}

<style jsx global>{`
  .custom-brightness {
    filter: brightness(3);
  }
`}</style>
export default Sidebar