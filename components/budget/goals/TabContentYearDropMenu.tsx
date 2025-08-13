import React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Control, FieldPath, UseFormSetValue } from 'react-hook-form';
import { authFormSchema, cn, budgetFrom } from '@/lib/utils';
import { Button } from '@/components/ui/button';
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
import { z } from 'zod';

const formSchema = budgetFrom('saving');

// Generate a list of the next 5 years including the current year
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, index) => ({
  label: `${currentYear + index}`,
  value: `${currentYear + index}`,
}));

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

const TabContentYearDropMenu = ({
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
          <div className="">
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
                      ? years.find((item) => item.value === field.value)?.label
                      : 'Select Year'}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command loop>
                  <CommandInput placeholder={placeholder} autoFocus />
                  <CommandList>
                    <CommandEmpty>No Year found.</CommandEmpty>
                    <CommandGroup>
                      {years.map((item) => (
                        <CommandItem
                          value={item.value}
                          key={item.value}
                          onSelect={() => {
                            setValue(name, item.value);
                            setIsOpen(false);
                          }}
                          className={cn(
                            'cursor-pointer bg-white',
                            'hover:bg-financeSidebar',
                            'aria-selected:bg-financeSidebar',
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

export default TabContentYearDropMenu;
