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
import { TabsContent } from '@/components/ui/tabs';
import { FormProvider, Form, useForm } from 'react-hook-form';
import TabContentDropMenu from './goals/TabContentDropMenu';
import { budgetFrom } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowRight, Loader2 } from 'lucide-react';
import TabContentYearDropMenu from './goals/TabContentYearDropMenu';
import TabContentInput from './utils/TabContentInput';
import { get_jwt, isJWTExpired, send_jwt } from '@/lib/auth';
import { create_JWT, getLoggedInUser } from '@/lib/actions/user.actions';
import { send_goals } from '@/lib/actions/transaction.actions';
import { useToast } from '@/hooks/use-toast';
import GoalsTable from './goals/GoalsTable';

const TabContentGoals = ({ goals, page, userCurrency }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const formSchema = budgetFrom('saving');

  // ✅ Added: Calculate current and next month/year as string values
  const today = new Date();
  const currentMonth = (today.getMonth() + 1).toString();
  const currentYear = today.getFullYear().toString();

  const nextMonthDate = new Date(today.getFullYear(), today.getMonth() + 1);
  const nextMonth = (nextMonthDate.getMonth() + 1).toString();
  const nextYear = nextMonthDate.getFullYear().toString();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: '',
      startMonth: currentMonth,
      startYear: currentYear,
      endMonth: nextMonth,
      endYear: nextYear,
    },
  });

  const onSubmitSavings = async (data: z.infer<typeof formSchema>) => {
    const loggedIn = await getLoggedInUser();
    try {
      setIsLoading(true);
      data['isSaving'] = 1;
      let jwt = await get_jwt(loggedIn?.$id);

      if (await isJWTExpired(jwt)) {
        jwt = await create_JWT();
        await send_jwt(jwt);
        jwt = await get_jwt(loggedIn?.$id);
      }

      await send_goals(jwt, data);

      toast({
        duration: 1000,
        variant: 'succes',
        title: 'Saving Goal is send!',
        description: 'Your Saving Goal is being saved.',
      });
      setIsLoading(false);
      window.location.reload();
    } catch (error) {
      console.error('Error submitting savings:', error);
      toast({
        duration: 1000,
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.',
      });
      setIsLoading(false);
    }
  };
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const loggedIn = await getLoggedInUser();
    try {
      setIsLoading2(true);
      data['isSaving'] = 0;
      let jwt = await get_jwt(loggedIn?.$id);

      if (await isJWTExpired(jwt)) {
        jwt = await create_JWT();
        await send_jwt(jwt);
        jwt = await get_jwt(loggedIn?.$id);
      }

      await send_goals(jwt, data);

      toast({
        duration: 1000,
        variant: 'succes',
        title: 'Saving Goal is send!',
        description: 'Your Saving Goal is being saved.',
      });
      setIsLoading2(false);
      window.location.reload();
    } catch (error) {
      console.error('Error submitting investing:', error);
      toast({
        duration: 1000,
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.',
      });
      setIsLoading2(false);
    }
  };
  return (
    <div>
      <TabsContent value="goals">
        <Card>
          <CardHeader>
            <CardTitle>Goals</CardTitle>
            <CardDescription>
              Make changes to your account here. Click save when done.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              Saving
              <FormProvider {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmitSavings)}
                  className="space-y-8"
                >
                  <div className="flex items-center">
                    <TabContentInput
                      control={form.control}
                      name="amount"
                      label="Amount"
                      placeholder="Enter your monthly amount"
                    />
                    <TabContentDropMenu
                      control={form.control}
                      setValue={form.setValue}
                      name="startMonth"
                      label="Start month"
                      placeholder="Select month"
                    />

                    <TabContentYearDropMenu
                      control={form.control}
                      setValue={form.setValue}
                      name="startYear"
                      label="Start year"
                      placeholder="Select month"
                    />

                    <ArrowRight
                      className="mx-3 w-8 h-8 translate-y-3 text-financeGradient"
                      strokeWidth={4}
                    />

                    <TabContentDropMenu
                      control={form.control}
                      setValue={form.setValue}
                      name="endMonth"
                      label="End Month"
                      placeholder="Select month"
                    />

                    <TabContentYearDropMenu
                      control={form.control}
                      setValue={form.setValue}
                      name="endYear"
                      label="End year"
                      placeholder="Select month"
                    />
                    <Button
                      type="submit"
                      disabled={isLoading || isLoading2}
                      className="form-btn mx-3 translate-y-3"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 size={20} className="animate-spin" /> &nbsp;
                          Loading...
                        </>
                      ) : (
                        'Save Savings'
                      )}
                    </Button>
                  </div>
                </form>
              </FormProvider>
            </div>
            <div className="space-y-1">
              Investing
              <FormProvider {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <div className="flex items-center">
                    <TabContentInput
                      control={form.control}
                      name="amount"
                      label="Amount"
                      placeholder="Enter your monthly amount"
                    />
                    <TabContentDropMenu
                      control={form.control}
                      setValue={form.setValue}
                      name="startMonth"
                      label="Start month"
                      placeholder="Select month"
                    />

                    <TabContentYearDropMenu
                      control={form.control}
                      setValue={form.setValue}
                      name="startYear"
                      label="Start year"
                      placeholder="Select month"
                    />

                    <ArrowRight
                      className="mx-3 w-8 h-8 translate-y-3 text-financeGradient"
                      strokeWidth={4}
                    />

                    <TabContentDropMenu
                      control={form.control}
                      setValue={form.setValue}
                      name="endMonth"
                      label="End Month"
                      placeholder="Select month"
                    />

                    <TabContentYearDropMenu
                      control={form.control}
                      setValue={form.setValue}
                      name="endYear"
                      label="End year"
                      placeholder="Select month"
                    />
                    <Button
                      type="submit"
                      disabled={isLoading || isLoading2}
                      className="form-btn mx-3 translate-y-3"
                    >
                      {isLoading2 ? (
                        <>
                          <Loader2 size={20} className="animate-spin" /> &nbsp;
                          Loading...
                        </>
                      ) : (
                        'Save Investing'
                      )}
                    </Button>
                  </div>
                </form>
              </FormProvider>
            </div>
          </CardContent>
          <CardFooter>{/* <Button>Save changes</Button> */}</CardFooter>
        </Card>
        <div>
          <GoalsTable
            goals={goals}
            page={Number(page)}
            rowPerPage={10}
            userCurrency={userCurrency}
          />
        </div>
      </TabsContent>
    </div>
  );
};

export default TabContentGoals;
