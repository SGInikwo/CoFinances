'use client';

import React, { useEffect, useState } from 'react';
import { Tabs, TabsList } from '@/components/ui/tabs';
import TabContentDashboard from '@/components/budget/TabContentDashboard';
import TabContentGoals from '@/components/budget/TabContentGoals';
import TabContentBudget from '@/components/budget/TabContentBudget';
import TabContentTrigger from '@/components/budget/utils/TabContentTrigger';

const TabContentMain = ({
  budget,
  budgetSummary,
  categoryNames,
  goals,
  current_goal,
  userCurrency,
  next_month_goal,
  page,
}) => {
  // Initialize with 'dashboard' on server, update on client
  const [selectedValue, setSelectedValue] = useState('dashboard');

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash) setSelectedValue(hash);
  }, []);

  const handleValueChange = (value) => {
    setSelectedValue(value);
    window.history.replaceState(null, '', `#${value}`);
  };

  const sortedGoals = [...goals].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <Tabs
      value={selectedValue} // controlled prop, NOT defaultValue
      onValueChange={handleValueChange}
      className="flex-col"
    >
      <TabsList className="grid w-full grid-cols-3">
        <TabContentTrigger selectedValue={selectedValue} />
      </TabsList>
      <TabContentDashboard
        budgetSummary={budgetSummary}
        current_goal={current_goal}
        userCurrency={userCurrency}
        next_month_goal={next_month_goal}
      />
      <TabContentGoals
        goals={sortedGoals}
        page={page}
        userCurrency={userCurrency}
      />
      <TabContentBudget
        budget={budget}
        categoryNames={categoryNames}
        userCurrency={userCurrency}
      />
    </Tabs>
  );
};

export default TabContentMain;
