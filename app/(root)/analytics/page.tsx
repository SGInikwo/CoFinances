import CurrentBarChart from '@/components/CurrentBarChart';
import DoughnutChart from '@/components/DoughnutChart';
import ExpensesCompareGraph from '@/components/ExpensesCompareGraph';
import MonthBarChart from '@/components/MonthBarChart';
import MonthCarousel from '@/components/MonthCarousel';
import MonthPolarChart from '@/components/MonthPolarChart';
import { get_current_analysis, get_past_analysis, get_summary_months } from '@/lib/actions/transaction.actions';
import { create_JWT, get_transactionList, getLoggedInUser } from '@/lib/actions/user.actions';
import { get_jwt, isJWTExpired, send_jwt } from '@/lib/auth';
import { notFound } from 'next/navigation';
import React from 'react'

interface PageProps {
  searchParams: {
    month: string | undefined;
    year: string | undefined;
    page: number | undefined;
  };
}

interface PastAnalysis {
  last_5: Record<string, number>;
  top_3: Record<string, number>;
}

const Analytics = async ({ searchParams }: PageProps) => {
  const { month: selectedMonth="null", year: selectedYear="null", page: currentPage=1 } = searchParams;

  const loggedIn = await getLoggedInUser();

  let transactions = [];
  let summary_month = [];
  let current_analysis = [];
  let past_analysis: PastAnalysis = { last_5: {}, top_3: {} }; 

  if (!loggedIn) {
    notFound(); // or handle it appropriately
  }

  let jwt = await get_jwt(loggedIn?.$id);
  
  if (await isJWTExpired(jwt)) {
    jwt = await create_JWT();
    await send_jwt(jwt);
    jwt = await get_jwt(loggedIn?.$id);
  }

  const [transactionList, monthList, current_analysis_list, past_analysis_list] = await Promise.all([
    get_transactionList(jwt, selectedMonth, selectedYear),
    get_summary_months(jwt),
    get_current_analysis(jwt, selectedMonth, selectedYear),
    get_past_analysis(jwt, selectedMonth, selectedYear),
  ]);

  transactions = transactionList;
  summary_month = monthList;
  current_analysis = current_analysis_list;
  past_analysis = past_analysis_list;

  // console.log("next", past_analysis)
  
  return (
    <section className='home'>
      <div className='home-content'>
        <div className='flex justify-center items-center pt-4'>
          <MonthCarousel months={summary_month} selectedMonth={selectedMonth} selectedYear={selectedYear}/>
        </div>
        
        <div className='flex w-full h-full gap-2 max-md:flex-col'>
          <div className='flex justify-center items-center shadow-chart border rounded-3xl p-4'>
            <DoughnutChart transactions={current_analysis} currency={loggedIn.currency}/>
          </div>
          <div className='border-gray-300 w-full h-full shadow-chart border rounded-3xl p-4'>
            <CurrentBarChart transactions={transactions} currency={loggedIn.currency}/>
          </div>
          
        </div>

        <div className='flex w-full h-full gap-2 max-md:flex-col'>
          <div className='border-gray-300 w-full h-full shadow-chart border rounded-3xl p-4'>
            <ExpensesCompareGraph transactions={transactions} currency={loggedIn.currency}/>
          </div>

        
        </div> 

        <div className='flex w-full h-full gap-2 max-md:flex-col'>
           <div className='border-gray-300 w-full h-full shadow-chart border rounded-3xl p-4'>
            <MonthBarChart transactions={past_analysis.last_5} currency={loggedIn.currency}/>
          </div>

          <div className='border-gray-300 w-full h-96 shadow-chart border rounded-3xl p-4'>
            <MonthPolarChart transactions={past_analysis.top_3} currency={loggedIn.currency}/>
          </div>
        </div>
       
        
      </div>
      
      
    </section>
  )
}

export default Analytics