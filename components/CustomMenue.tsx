import React from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { Check, ChevronsUpDown } from "lucide-react"
import { Control, FieldPath, FieldValues, Path, PathValue, UseFormSetValue } from 'react-hook-form';
import { authFormSchema } from '@/lib/utils'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

import { z } from "zod"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  FormControl,
  FormField,
  FormLabel,
} from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const formSchema = authFormSchema('sign-up')

const currency = [
  { label: "Euros", value: "0" },
  { label: "Won", value: "1" },
  { label: "KES", value: "2" },
] as const

interface CustomInput {
  control: Control<z.infer<typeof formSchema>>;
  setValue: (name: FieldPath<z.infer<typeof formSchema>>, value: string, options?: any) => void;
  name: FieldPath<z.infer<typeof formSchema>>;
  label: string;
  placeholder: string;
}

// interface CustomInput {
//   control: Control<z.infer<typeof formSchema>>,
//   setValue: <TFieldName extends keyof z.infer<typeof formSchema>>(
//     name: TFieldName,
//     value: z.infer<typeof formSchema>[TFieldName],
//     options?: {
//       shouldValidate?: boolean;
//       shouldDirty?: boolean;
//       shouldTouch?: boolean;
//     }
//   ) => void;
//   name: FieldPath<z.infer<typeof formSchema>>,
//   label: string,
//   placeholder: string
// }

const CustomMenue = ({ control, setValue, name, label, placeholder }: CustomInput) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <div className='flex items-center'>
          <FormLabel>{label}</FormLabel>
          <div className='p-2'>
            <Popover open={isOpen} onOpenChange={setIsOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "w-[200px] justify-between",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value
                      ? currency.find((item) => item.value === field.value)?.label
                      : "Select Currency"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput placeholder={placeholder} />
                  <CommandList>
                    <CommandEmpty>No Currency found.</CommandEmpty>
                    <CommandGroup>
                      {currency.map((item) => (
                        <CommandItem
                          value={item.value}
                          key={item.value}
                          onSelect={() => {
                            setValue(name, item.value); // Set the correct value
                            setIsOpen(false); // Close the dropdown
                          }}
                          className="cursor-pointer"
                        >
                          {item.label}
                          <Check
                            className={cn(
                              "ml-auto",
                              item.value === field.value ? "opacity-100" : "opacity-0"
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

export default CustomMenue;