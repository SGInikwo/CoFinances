import { sidebarLinks } from '@/constants';
import Link from 'next/link';
import React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils';

const BankManue = () => {
  return (
    <div>
      {sidebarLinks.map((item) => {
        // const isActive = pathName === item.route || pathName.startsWith(`${item.route}/`);
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
            <p className={cn("sidebar-label", { "!text-white": isActive })}>
              {item.label}
            </p>  
          </Link>
        )
      })}
    </div>
  )
}

export default BankManue