import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { FormProvider, Form, useForm } from 'react-hook-form';
import TabContentInput from '../utils/TabContentInput';
import { budgetFrom } from '@/lib/utils';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Loader2 } from 'lucide-react';
import { get_jwt, isJWTExpired, send_jwt } from '@/lib/auth';
import { create_JWT, getLoggedInUser } from '@/lib/actions/user.actions';
import { add_category } from '@/lib/actions/category.actions';
import { useToast } from '@/hooks/use-toast';

const AddCategory = ({ selectedColor, handleChangeComplete }) => {
  const [isLoading, setIsLoading] = useState(false);
  const formSchema = budgetFrom('budget');
  const { toast } = useToast();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoryName: '',
    },
  });

  useEffect(() => {
    form.setValue('categoryColor', selectedColor);
  }, [selectedColor, form]);

  const onSubmitSavings = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    const loggedIn = await getLoggedInUser();

    try {
      let jwt = await get_jwt(loggedIn?.$id);

      if (await isJWTExpired(jwt)) {
        jwt = await create_JWT();
        await send_jwt(jwt);
        jwt = await get_jwt(loggedIn?.$id);
      }
      const capitalizedData = {
        ...data,
        categoryName:
          (data.categoryName ?? '').charAt(0).toUpperCase() +
          (data.categoryName ?? '').slice(1).toLowerCase(),
      };

      await add_category(jwt, capitalizedData);

      handleChangeComplete('#fff');
      form.reset({
        categoryName: '',
        categoryColor: '#fff',
      });

      console.log('lets see', capitalizedData);
      toast({
        duration: 1000,
        variant: 'succes',
        title: 'Category is send!',
        description: 'Your Category is being saved.',
      });
      setIsLoading(false);
      const currentTab = window.location.hash || '#budget';

      // Update the URL hash and reload the page fully:
      window.location.hash = currentTab;
      window.location.reload();
    } catch (error) {
      toast({
        duration: 1000,
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.',
      });
      setIsLoading(false);
    }
  };

  return (
    <section>
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmitSavings)}
          className="space-y-8"
        >
          <div className="flex items-center">
            <TabContentInput
              control={form.control}
              name="categoryName"
              label="Category"
              placeholder="Category Name"
            />

            <TabContentInput
              control={form.control}
              name="categoryColor"
              label="Color"
              placeholder="Color"
              hidden={true}
            />

            <Button
              type="submit"
              disabled={isLoading}
              className="form-btn mx-3 translate-y-3"
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" /> &nbsp;
                  Loading...
                </>
              ) : (
                'Add Category'
              )}
            </Button>
          </div>
        </form>
      </FormProvider>
    </section>
  );
};

export default AddCategory;
