import AnimatedCounter from './AnimatedCounter'

const CurrentBalanceBox = ({ type, totalCurrentBalance, totalPreviousBalance, totalTransactions}: CurrentBalanceBoxProps) => {
  return (
    <section className='current-balance'>
      <div className='current-balance-chart'>
        {/* Image comes here */}
      </div>

      <div className='flex flex-col gap-6'>
        <h2 className='header-2'>
          Some text here
        </h2>
        <div className='flex flex-col gap-2'>
          <p className='current-balance-label'>
            Total Current {type}
          </p>

          <div className='current-balance-amount flex center gap-2'>
            <AnimatedCounter amount={totalCurrentBalance}/>
            <AnimatedCounter amount={totalPreviousBalance}/>
            <AnimatedCounter amount={totalTransactions}/>
            
          </div>
        </div>

      </div>

      
    </section>
  )
}

export default CurrentBalanceBox