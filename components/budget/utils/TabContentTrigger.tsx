import React from 'react';
import { TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface Props {
  selectedValue: string;
}

const TabContentTrigger = ({ selectedValue }: Props) => {
  return (
    <>
      <TabsTrigger
        value="dashboard"
        className={cn('w-full text-gray-500', {
          'border border-b-2 border-b-financeGradient text-black':
            selectedValue === 'dashboard',
        })}
      >
        Dashboard
      </TabsTrigger>
      <TabsTrigger
        value="goals"
        className={cn('w-full text-gray-500', {
          'border border-b-2 border-b-financeGradient text-black':
            selectedValue === 'goals',
        })}
      >
        Goals
      </TabsTrigger>
      <TabsTrigger
        value="budget"
        className={cn('w-full text-gray-500', {
          'border border-b-2 border-b-financeGradient text-black':
            selectedValue === 'budget',
        })}
      >
        Budget
      </TabsTrigger>
    </>
  );
};

export default TabContentTrigger;
