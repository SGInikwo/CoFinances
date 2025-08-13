import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, ChevronsUpDown } from 'lucide-react';
import {
  Control,
  FieldPath,
  FieldValues,
  Path,
  PathValue,
  UseFormSetValue,
} from 'react-hook-form';
import { authFormSchema, budgetFrom } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

import { z } from 'zod';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { FormControl, FormField, FormLabel } from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

const formSchema = budgetFrom('saving');

const months = [
  { label: 'January', value: '1' },
  { label: 'February', value: '2' },
  { label: 'March', value: '3' },
  { label: 'April', value: '4' },
  { label: 'Mei', value: '5' },
  { label: 'June', value: '6' },
  { label: 'July', value: '7' },
  { label: 'August', value: '8' },
  { label: 'September', value: '9' },
  { label: 'October', value: '10' },
  { label: 'November', value: '11' },
  { label: 'December', value: '12' },
] as const;

interface CustomInput {
  control: Control<z.infer<typeof formSchema>>;
  setValue: (
    name: FieldPath<z.infer<typeof formSchema>>,
    value: string,
    options?: any,
  ) => void;
  name: FieldPath<z.infer<typeof formSchema>>;
  label: string;
  placeholder: string;
}

const TabContentDropMenu = ({
  control,
  setValue,
  name,
  label,
  placeholder,
}: CustomInput) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <div className="form-item">
          <FormLabel className="form-label">{label}</FormLabel>
          <div className=" ">
            <Popover open={isOpen} onOpenChange={setIsOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={isOpen}
                    className={cn(
                      'justify-between',
                      !field.value && 'text-muted-foreground',
                    )}
                  >
                    {field.value
                      ? months.find((item) => item.value === field.value)?.label
                      : 'Select Month'}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command loop>
                  <CommandInput placeholder={placeholder} autoFocus />
                  <CommandList>
                    <CommandEmpty>No Month found.</CommandEmpty>
                    <CommandGroup>
                      {months.map((item) => (
                        <CommandItem
                          value={item.value}
                          key={item.value}
                          onSelect={() => {
                            setValue(name, item.value); // Set the correct value
                            setIsOpen(false); // Close the dropdown
                          }}
                          className={cn(
                            'cursor-pointer bg-white',
                            'hover:bg-financeSidebar', // Hover state
                            'aria-selected:bg-financeSidebar', // Keyboard focus (overrides hover)
                            'hover:bg-white aria-selected:hover:bg-financeSidebar',
                          )}
                        >
                          {item.label}
                          <Check
                            className={cn(
                              'ml-auto',
                              item.value === field.value
                                ? 'opacity-100'
                                : 'opacity-0',
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
        </div>
      )}
    />
  );
};

export default TabContentDropMenu;
