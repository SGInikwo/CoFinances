import CurrentBalanceBox from '@/components/CurrentBalanceBox'
import HeaderBox from '@/components/HeaderBox'
import TransactionTable from '@/components/TransactionTable'
import Calendar from '@/components/Calender'
import { get_all_summary, get_summary, get_summary_months, update_transaction_currency } from '@/lib/actions/transaction.actions'
import { create_JWT, get_transactionList, getLoggedInUser } from '@/lib/actions/user.actions'
import { get_jwt, isJWTExpired, send_jwt } from '@/lib/auth'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import MonthCarousel from '@/components/MonthCarousel'
import { Pagination } from '@/components/Pagination'
import ExpensesGraph from '@/components/ExpensesGraph'

interface PageProps {
  searchParams: {
    month: string | undefined;
    year: string | undefined;
    page: number | undefined;
  };
}

const Home = async ({ searchParams }: PageProps) => {
  const { month: selectedMonth="null", year: selectedYear="null", page: currentPage=1 } = searchParams;

  const loggedIn = await getLoggedInUser();

  let transactions = [];
  let summaries = [];
  let monthlyBalance = 0;
  let monthlyExpenses = 0;
  let monthlySavings = 0;
  let earliestBalance = 0;
  let earliestExpenses = 0;
  let earliestSavings = 0;
  let summary_month = [];

  if (!loggedIn) {
    notFound(); // or handle it appropriately
  }

  let jwt = await get_jwt(loggedIn?.$id);

  if (await isJWTExpired(jwt)) {
    jwt = await create_JWT();
    await send_jwt(jwt);
    jwt = await get_jwt(loggedIn?.$id);
  }

  
  const [transactionList, allSummaries, monthList, transactionSummary] = await Promise.all([
    get_transactionList(jwt, selectedMonth, selectedYear),
    get_all_summary(jwt),
    get_summary_months(jwt),
    get_summary(jwt, selectedMonth, selectedYear).catch(() => null), // Pass selectedMonth to get_summary
  ]);

  transactions = transactionList;
  summaries = allSummaries;
  summary_month = monthList;
  monthlyBalance = transactionSummary?.monthlyBalance ? Number(transactionSummary.monthlyBalance) : 0;
  monthlyExpenses = transactionSummary?.monthlyExpenses ? Number(transactionSummary.monthlyExpenses) : 0;
  monthlySavings = transactionSummary?.monthlySavings ? Number(transactionSummary.monthlySavings) : 0;

  earliestBalance = transactionSummary?.earliestBalance ? Number(transactionSummary.earliestBalance) : 0;
  earliestExpenses = transactionSummary?.earliestExpenses ? Number(transactionSummary.earliestExpenses) : 0;
  earliestSavings = transactionSummary?.earliestSavings ? Number(transactionSummary.earliestSavings) : 0;

  const percBalance = (monthlyBalance - earliestBalance) / earliestBalance
  const percExpenses = (monthlyExpenses - earliestExpenses) / earliestExpenses
  const percSavings = (monthlySavings - earliestSavings) / earliestSavings

  return (
    <section className='home'>
      <div className='home-content'>
        {/* Top of the bage (welcome) */}
        <HeaderBox 
          type='greeting'
          title='Welcome'
          user={loggedIn?.firstName || 'Guest'}
          userInfo={loggedIn?.$id}
          subtext='Access and manage your spending and savings'
          currency={String(loggedIn?.currency)}
        />

        <div className='flex justify-center items-center'>
          <MonthCarousel months={summary_month} selectedMonth={selectedMonth} selectedYear={selectedYear}/>
        </div>

        {/* Summaries */}
        <div className='flex gap-1 w-full max-md:flex-col'>
          <CurrentBalanceBox
            type='Balance'
            image_name='icons/money_balance.svg'
            totalCurrentBalance={monthlyBalance}
            totalPreviousBalance={earliestBalance}
            totalTransactions={percBalance}
            user_currency={loggedIn?.currency}
          />

          <CurrentBalanceBox
            type='Expense'
            image_name='icons/expens.svg'
            totalCurrentBalance={monthlyExpenses}
            totalPreviousBalance={earliestExpenses}
            totalTransactions={percExpenses}
            user_currency={loggedIn?.currency}
          />

          <CurrentBalanceBox
            type='Savings'
            image_name='icons/bank.svg'
            totalCurrentBalance={monthlySavings}
            totalPreviousBalance={earliestSavings}
            totalTransactions={percSavings}
            user_currency={loggedIn?.currency}
          />

          <div className='hidden'>
            <CurrentBalanceBox
              type='Savings'
              image_name='icons/invest.svg'
              totalCurrentBalance={100050.00}
              totalPreviousBalance={500.20}
              totalTransactions={1}
              user_currency={loggedIn?.currency}
            />
          </div>
        </div>
        
        {/* Graph and Calendar */}
        <div className="flex w-full h-full gap-2 max-md:flex-col">
          <div className="flex-[1_1_60%] border rounded-lg">
            <ExpensesGraph transactions={transactions} currency={loggedIn?.currency}/>
          </div>
          <div className="flex-[1_1_40%]">
            <Calendar summaries={summaries} currency={loggedIn?.currency} />
          </div>
        </div>

        {/* Transaction Table */}
        <div>
          <TransactionTable transactions={transactions} currency={loggedIn?.currency} page={Number(currentPage)} rowPerPage={10}/>
        </div>
      </div>
    </section>
  );
};

export default Home;
