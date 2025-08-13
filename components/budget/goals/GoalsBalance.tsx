import Image from 'next/image';
import AnimatedCounter from '../../AnimatedCounter';

const GoalsBalance = ({
  type,
  totalCurrentBalance,
  totalPreviousBalance,
  totalTransactions,
  user_currency,
}: CurrentBalanceBoxProps) => {
  const currency =
    user_currency === 0
      ? '€'
      : user_currency === 1
        ? '₩'
        : user_currency === 2
          ? 'KES'
          : user_currency === 3
            ? '£'
            : '$';

  return (
    <section className="current-balance">
      <div className="flex flex-col gap-1 current-balance-label">
        <h2 className="header-2 current-balance-label">{type}:</h2>
        <div className="">
          <div className="current-balance-amount flex items-center">
            <div className="current-balance-label w-38">
              <AnimatedCounter
                amount={totalCurrentBalance}
                currency={currency}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GoalsBalance;
