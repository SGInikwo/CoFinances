'use client';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import React from 'react';
import { Button } from './ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { create_JWT, updateuserCurrency } from '@/lib/actions/user.actions';
import {
  push_data,
  update_transaction_currency,
} from '@/lib/actions/transaction.actions';
import { get_jwt, isJWTExpired, send_jwt } from '@/lib/auth';
import CurrencyLoader from './CurrencyLoader';
import CurrencyMenue from './CurrencyMenue';
import MonthCarousel from './MonthCarousel';

const currencies = [
  { label: 'EUR', value: '0' },
  { label: 'KRW', value: '1' },
  { label: 'KES', value: '2' },
  { label: 'GBP', value: '3' },
  { label: 'USD', value: '4' },
] as const;

const HeaderBox = ({
  type = 'title',
  title,
  subtext,
  user,
  userInfo,
  currency,
}: HeaderBoxProps) => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(currency);
  const [openDialog, setOpenDialog] = React.useState(false);

  const updateCurrency = async (selectedCurrency: string) => {
    try {
      await updateuserCurrency({ newCurrency: selectedCurrency });

      let jwt = await get_jwt(userInfo);

      if (await isJWTExpired(jwt)) {
        jwt = await create_JWT();

        await send_jwt(jwt);

        jwt = await get_jwt(userInfo);
      }

      setOpenDialog(true);
      await update_transaction_currency(jwt, selectedCurrency);
      await push_data(jwt);
      setOpenDialog(false);

      window.location.reload();
    } catch (error) {
      console.error('Error updating currency: ', error);
    }
  };
  return (
    <section className="flex justify-between">
      <div className="header-box">
        <h1 className="header-box-title">
          {title}
          {type === 'greeting' && (
            <span className="text-financeGradient">&nbsp;{user}</span>
          )}
        </h1>
        <p className="header-box-subtext">{subtext}</p>
      </div>

      <CurrencyMenue
        currencies={currencies}
        open={open}
        setOpen={setOpen}
        value={value}
        setValue={setValue}
        updateCurrency={updateCurrency}
      />

      <CurrencyLoader open={openDialog} setOpen={setOpenDialog} />
    </section>
  );
};

export default HeaderBox;
