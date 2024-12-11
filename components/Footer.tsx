import { logoutAccount } from '@/lib/actions/user.actions'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'

const Footer = ({ user, type = 'desktop' }: FooterProps) => {
  const router = useRouter()
  const handleLogOut = async () => {
    const loggedOut = await logoutAccount();

    if(loggedOut) router.push('/sign-in')
  }

  return (
    <footer className='footer'>
      <div className='footer_image' onClick={handleLogOut}>
        <Image
          src='icons/logout.svg'
          fill
          alt='logout'
        />
      </div>
    </footer>
  )
}

export default Footer