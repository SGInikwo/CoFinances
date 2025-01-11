import Image from 'next/image';
import AnimatedCounter from './AnimatedCounter';

const CurrentBalanceBox = ({
  type,
  image_name,
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
      <div className="current-balance-chart gap-1 items-center max-tablet:hidden max-md:flex">
        <Image src={image_name} alt="balance" width={30} height={30} />
      </div>

      <div className="flex flex-col gap-1 current-balance-label">
        <h2 className="header-2 current-balance-label">Total Current {type}</h2>
        <div className="">
          <div className="current-balance-amount flex items-center">
            <div className="current-balance-label w-38">
              <AnimatedCounter
                amount={totalCurrentBalance}
                currency={currency}
              />
            </div>

            <div className="font-normal text-10 items-center p-3">
              <AnimatedCounter amount={totalTransactions} currency="%" />
            </div>
          </div>

          <div className="flex gap-1 text-10 w-33">
            <AnimatedCounter
              amount={totalPreviousBalance}
              currency={`${currency}`}
            />

            <div className="">from last month</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CurrentBalanceBox;
