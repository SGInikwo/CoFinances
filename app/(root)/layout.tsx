export const dynamic = 'force-dynamic';

import MobileNav from '@/components/MobileNav';
import Sidebar from '@/components/Sidebar';
import { getLoggedInUser, logoutAccount } from '@/lib/actions/user.actions';
import Image from 'next/image';
import { redirect } from 'next/navigation';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const loggedIn = await getLoggedInUser();

  if (!loggedIn) {
    redirect('/sign-in');
  }

  if (loggedIn.authLevel !== -1) {
    try {
      await logoutAccount();
    } catch (e) {
      console.error('No active session to log out', e);
    }
    redirect('/sign-in');
  }

  return (
    <main className="flex h-screen w-full font-">
      <Sidebar user={loggedIn} />

      <div className="flex flex-col flex-1 h-screen overflow-y-auto">
        <div className="root-layout bg-financeSidebar flex items-center gap-2 p-4">
          <Image src="/icons/logo.svg" width={30} height={30} alt="Menu icon" />
          <div>
            <MobileNav user={loggedIn} />
          </div>
        </div>
        {children}
      </div>
    </main>
  );
}
