'use client'

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { sidebarLinks } from "@/constants"
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Footer from "./Footer"



const MobileNav = ({ user }: MobileNavProps) => {
  const pathName = usePathname()
  return (
    <section className='w-full max-w-[264px]'>
      <Sheet>
        <SheetTrigger>
          <Image
            src='/icons/burger.svg'
            width={30}
            height={30}
            alt='Menu'
            className='cursor-pointer'
          />
        </SheetTrigger>
        <SheetContent side='left' className='border-none bg-financeSidebar'>
          <Link href='/' className='cursor-pointer flex items-center gap-1 px-4'>
            <Image
              src='/icons/logo.svg'
              width={38}
              height={38}
              alt='CoFinance Logo'
              // className='size-[36px] max-xl:size-14'
            />
            <h1 className='text-26 font-avro font-semibold text-black'>CoFinance</h1>
          </Link>
          <div className='mobileNav-sheet'>
            <SheetClose asChild>
              <nav className='flex h-full flex-col gap-6 pt-16 text-white'>
                {sidebarLinks.map((item) => {
                  const isActive = pathName === item.route || pathName.startsWith(`${item.route}/`);
                  return (
                    <SheetClose asChild key={item.label}>
                      <Link 
                        href={item.route} 
                        key={item.label}
                        className={cn('mobileNav-sheet_close w-full', {
                          'bg-financeGradient': isActive
                        })}
                      >
                        <Image 
                          src={item.imgURL}
                          alt={item.label}
                          width={20}
                          height={20}
                          className={cn('filter', {
                            'brightness-0 invert': isActive
                          })}
                        />
                        <p className={cn("text-16 font-semibold text-black", { "text-white": isActive })}>
                          {item.label}
                        </p>
                      </Link>
                    </SheetClose>
                  )
                })}
              </nav>
            </SheetClose>

            <Footer user={user} type='mobile'/>
            
          </div>
        </SheetContent>
      </Sheet>

    </section>
  )
}

export default MobileNav