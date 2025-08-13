import React from 'react';
import TabContentMain from '@/components/budget/TabContentMain';
import { getLoggedInUser, create_JWT } from '@/lib/actions/user.actions';
import { get_jwt, isJWTExpired, send_jwt } from '@/lib/auth';
import { get_all_budget, get_all_summary } from '@/lib/actions/budget.actions';
import { get_category_name } from '@/lib/actions/category.actions';
import { get_goals } from '@/lib/actions/goal.actions';

// Helper to format YYYY-MM in local time
function formatYearMonthLocal(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-based
  return `${year}-${month}`;
}

interface PageProps {
  searchParams: {
    page: number | undefined;
  };
}

const Budget = async ({ searchParams }: PageProps) => {
  const { page: currentPage = 1 } = searchParams;
  // Get current and next month in local time
  const currentDate = new Date();
  const currentMonth = formatYearMonthLocal(currentDate);

  const nextMonthDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    1,
  );
  const nextMonthStr = formatYearMonthLocal(nextMonthDate);

  const loggedIn = await getLoggedInUser();

  let jwt = await get_jwt(loggedIn?.$id);

  if (await isJWTExpired(jwt)) {
    jwt = await create_JWT();
    await send_jwt(jwt);
    jwt = await get_jwt(loggedIn?.$id);
  }

  const budget = await get_all_budget(jwt);
  const budgetSummary = await get_all_summary(jwt);
  const categoryNames = await get_category_name(jwt);
  const goals = await get_goals(jwt);

  // Find goals for current and next month
  const current_goal = goals.find((goal) => goal.date === currentMonth) || null;
  const next_month_goal =
    goals.find((goal) => goal.date === nextMonthStr) || null;

  console.log('currentMonth:', goals.length);
  console.log('nextMonthStr:', nextMonthStr);

  return (
    <section>
      <TabContentMain
        budget={budget}
        budgetSummary={budgetSummary}
        categoryNames={categoryNames}
        goals={goals}
        current_goal={current_goal}
        userCurrency={loggedIn?.currency}
        next_month_goal={next_month_goal}
        page={Number(currentPage)}
      />
    </section>
  );
};

export default Budget;
