import React from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Button } from './ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const CurrencyMenue = ({
  currencies,
  open,
  setOpen,
  value,
  setValue,
  updateCurrency,
}) => {
  return (
    <div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[80px] justify-between rounded-full hover:border-financeGradient"
          >
            {value
              ? currencies.find((currency) => currency.value === value)?.label
              : 'Select framework...'}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search framework..." className="h-9" />
            <CommandList>
              <CommandEmpty>No framework found.</CommandEmpty>
              <CommandGroup>
                {currencies.map((currency) => (
                  <CommandItem
                    key={currency.value}
                    value={currency.value}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? '' : currentValue);
                      updateCurrency(currentValue);
                      setOpen(false);
                    }}
                    className={cn(
                      'cursor-pointer bg-white',
                      'hover:bg-financeSidebar', // Hover state
                      'aria-selected:bg-financeSidebar', // Keyboard focus (overrides hover)
                      'hover:bg-white aria-selected:hover:bg-financeSidebar',
                    )}
                  >
                    {currency.label}
                    <Check
                      className={cn(
                        'ml-auto',
                        value === currency.value ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default CurrencyMenue;
