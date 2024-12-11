declare type SignUpParams = {
  firstName?: string;
  lastName?: string;
  currency?: string;
  email: string;
  password: string;
};

declare interface signInProps {
  email: string;
  password: string;
}

declare type LoginUser = {
  email: string;
  password: string;
};

declare type User = {
  $id: string;
  userId: string;
  firstName: string;
  lastName: string;
  name: string;
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

declare interface FooterProps {
  user: User;
  type?: 'mobile' | 'desktop'
}