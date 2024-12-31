export const dynamic = 'force-dynamic'

import MobileNav from "@/components/MobileNav";
import Sidebar from "@/components/Sidebar";
import { getLoggedInUser, logoutAccount } from "@/lib/actions/user.actions";
import Image from 'next/image'
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const loggedIn = await getLoggedInUser()

  if(!loggedIn || loggedIn.authLevel !== -1) {
    if (loggedIn) await logoutAccount(); 
    redirect('/sign-in')
  }

  return (
    <main className='flex h-screen w-full font-'>
        <Sidebar user={loggedIn}/>

        <div className='flex size-full flex-col'>
          <div className='root-layout bg-financeSidebar'>
            <Image 
              src='/icons/logo.svg'
              width={30}
              height={30}
              alt='Menu icon'
            /> 
            <div>
              <MobileNav user={loggedIn}/>
            </div>
          </div>
          {children}
        </div>
    </main>
  );
}
