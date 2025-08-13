import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FormProvider, Form, useForm } from 'react-hook-form';
import TabContentDropMenu from './goals/TabContentDropMenu';
import { authFormSchema } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import CurrentBarChart from './dashboard/CurrentBarChart';
import GoalsBalance from './goals/GoalsBalance';

const TabContentDashboard = ({
  budgetSummary,
  current_goal,
  next_month_goal,
  userCurrency,
}) => {
  const month_year = current_goal
    ? new Date(`${current_goal.date}-01`).toLocaleString('en-US', {
        month: 'long',
        year: 'numeric',
      })
    : '';

  const next_month_year = next_month_goal
    ? new Date(`${next_month_goal.date}-01`).toLocaleString('en-US', {
        month: 'long',
        year: 'numeric',
      })
    : '';

  return (
    <div>
      <TabsContent value="dashboard">
        <Card>
          <CardHeader>
            <CardTitle>Dashboard</CardTitle>
            <CardDescription>
              Saving and investment goals setting.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <section className="">
              <div className="flex justify-center">
                <div className="w-fit text-center">
                  <div className="current-balance-amount flex items-center justify-center">
                    <div className="current-balance-label !text-financeGradient">
                      {month_year}
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <div className="grid grid-cols-3 gap-1 w-full max-md:grid-cols-1">
              <GoalsBalance
                type={'Actual Balance' + month_year}
                totalCurrentBalance={current_goal.actualBalance}
                totalPreviousBalance={0}
                totalTransactions={0}
                user_currency={userCurrency}
                image_name={''}
              />
              <GoalsBalance
                type={'Virtual Balance'}
                totalCurrentBalance={current_goal.virtualBalance}
                totalPreviousBalance={0}
                totalTransactions={0}
                user_currency={userCurrency}
                image_name={''}
              />
              <GoalsBalance
                type={'Actual Saving'}
                totalCurrentBalance={current_goal.actualSaving}
                totalPreviousBalance={0}
                totalTransactions={0}
                user_currency={userCurrency}
                image_name={''}
              />
              <GoalsBalance
                type={'Virtual Saving'}
                totalCurrentBalance={current_goal.virtualSaving}
                totalPreviousBalance={0}
                totalTransactions={0}
                user_currency={userCurrency}
                image_name={''}
              />
              <GoalsBalance
                type={'Actual Investing'}
                totalCurrentBalance={current_goal.actualInvesting}
                totalPreviousBalance={0}
                totalTransactions={0}
                user_currency={userCurrency}
                image_name={''}
              />
              <GoalsBalance
                type={'Virtual Investing'}
                totalCurrentBalance={current_goal.virtualInvesting}
                totalPreviousBalance={0}
                totalTransactions={0}
                user_currency={userCurrency}
                image_name={''}
              />
            </div>
            <div className="flex justify-center font-bold text-2xl">
              {next_month_goal === null
                ? 'There is no goal set for next month.'
                : `Next Goal is set for ${next_month_year}`}
            </div>

            <div className="space-y-1">
              <CurrentBarChart
                budgetSummary={budgetSummary}
                currency={userCurrency}
              />
            </div>
          </CardContent>
          <CardFooter>{/* <Button>Save changes</Button> */}</CardFooter>
        </Card>
      </TabsContent>
    </div>
  );
};

export default TabContentDashboard;
