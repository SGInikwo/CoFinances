import React from 'react';
import { Control, FieldPath } from 'react-hook-form';
import { z } from 'zod';
import { authFormSchema, budgetFrom } from '@/lib/utils';
import { FormControl, FormField, FormLabel, FormMessage } from '../../ui/form';
import { Input } from '../../ui/input';

const formSchema = budgetFrom('saving');

interface CustomInput {
  control: Control<z.infer<typeof formSchema>>;
  name: FieldPath<z.infer<typeof formSchema>>;
  label: string;
  placeholder: string;
  hidden?: boolean;
}

const TabContentInput = ({
  control,
  name,
  label,
  placeholder,
  hidden = false,
}: CustomInput) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <div className={`form-item ${hidden ? 'sr-only' : ''}`}>
          <FormLabel className="form-label">{label}</FormLabel>
          <div className="flex w-full flex-col">
            <FormControl>
              <Input
                placeholder={placeholder}
                className="input-class"
                type="text"
                {...field}
              />
            </FormControl>
            <FormMessage className="form-message mt-2" />
          </div>
        </div>
      )}
    />
  );
};

export default TabContentInput;
