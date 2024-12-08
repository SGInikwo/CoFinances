declare interface HeaderBoxProps {
  type?: "title" | "greeting";
  title: string;
  subtext: string;
  user?: string;
}

declare interface CurrentBalanceBoxProps {
  totalCurrentBalance: number;
  totalPreviousBalance: number;
  totalTransactions: number;
}