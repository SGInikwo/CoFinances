import TransactionTable from '@/components/TransactionTable';
import { create_JWT, get_all_transactionList, getLoggedInUser } from '@/lib/actions/user.actions';
import { get_jwt, isJWTExpired, send_jwt } from '@/lib/auth';
import React from 'react'

interface PageProps {
  searchParams: {
    page: number | undefined;
  };
}

const Transactions = async ({searchParams}: PageProps) => {
  const { page: currentPage=1 } = searchParams;

  const loggedIn = await getLoggedInUser();

  let jwt = await get_jwt(loggedIn?.$id);
  
  if (await isJWTExpired(jwt)) {
    jwt = await create_JWT();
    await send_jwt(jwt);
    jwt = await get_jwt(loggedIn?.$id);
  }

  const transactions = await get_all_transactionList(jwt)
  return (
    <section className='home'>
      <div className='home-content'>
        <div className='header-box'>
          <h1 className='font-bold text-center'>Full Transactions</h1>
        </div>
        <TransactionTable transactions={transactions} currency={loggedIn?.currency} page={Number(currentPage)} rowPerPage={15}/>
      </div>
      
    </section>
  )
}

export default Transactions