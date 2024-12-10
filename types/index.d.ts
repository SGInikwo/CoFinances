declare type User = {
  $id: string;
  userId: string;
  firstName: string;
  lastName: string;
  currency: string;
}

declare interface HeaderBoxProps {
  type?: "title" | "greeting";
  title: string;
  subtext: string;
  user?: string;
}

declare interface CurrentBalanceBoxProps {
  type: string;
  totalCurrentBalance: number;
  totalPreviousBalance: number;
  totalTransactions: number;
}

declare interface SidebarProps {
  user: User;
}

declare interface MobileNavProps {
  user: User;
}