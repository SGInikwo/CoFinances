import { logoutAccount } from '@/lib/actions/user.actions';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

const Footer = ({ user, type = 'desktop' }: FooterProps) => {
  const router = useRouter();
  const handleLogOut = async () => {
    const loggedOut = await logoutAccount();

    if (loggedOut) router.push('/sign-in');
  };

  return (
    <footer className="footer items-center">
      <div className={type === 'mobile' ? 'footer_name-mobile' : 'footer_name'}>
        <p className="flex flex-row text-xl font-bold text-gray-700 max-sm:text-sm max-sm:justify-start max-sm:items-center">
          {user.firstName[0]}
        </p>
      </div>
      <div
        className={type === 'mobile' ? 'footer_email-mobile' : 'footer_email'}
      >
        <h1 className="text-14 truncate text-gray-700 font-semibold">
          {user?.firstName} {user?.lastName}
        </h1>
      </div>

      <div className="footer_image" onClick={handleLogOut}>
        <Image
          src="icons/logout.svg"
          fill
          alt="logout"
          className="filter:brightness-0"
        />
      </div>
    </footer>
  );
};

export default Footer;
