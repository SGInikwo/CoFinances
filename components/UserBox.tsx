'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import {
  swapForward,
  swapUsers,
  updateUserSwapCode,
} from '@/lib/actions/user.actions';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

const swapSchema = z.object({
  swapcode: z
    .string()
    .regex(/^\d{4}$/, { message: 'Swap code must be exactly 4 digits.' })
    .refine((value) => value !== '0000', {
      message: 'Swap code cannot be 0000.',
    }),
});

const setSwapCodeSchema = z.object({
  setswapcode: z
    .string()
    .regex(/^\d{4}$/, { message: 'Swap code must be exactly 4 digits.' })
    .refine((value) => value !== '0000', {
      message: 'Swap code cannot be 0000.',
    }),
});

const UserBox = ({ user, swapUser }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);

  // Form for swapping
  const swapForm = useForm<z.infer<typeof swapSchema>>({
    resolver: zodResolver(swapSchema),
    defaultValues: { swapcode: '' },
  });

  // Form for setting swap code
  const setSwapCodeForm = useForm<z.infer<typeof setSwapCodeSchema>>({
    resolver: zodResolver(setSwapCodeSchema),
    defaultValues: { setswapcode: '' },
  });

  // Swap form submission
  async function onSubmitSwap(values: z.infer<typeof swapSchema>) {
    setIsLoading2(true);
    try {
      const response = await swapUsers({
        code: values.swapcode,
        swapUser: swapUser,
      });

      if (response) {
        await swapForward({ session: response });
        toast({
          duration: 1000,
          variant: 'succes',
          title: 'Switch succes',
          description: 'You are swapping',
        });
        router.push('/');
        setIsLoading2(false);
      }
    } catch (error) {
      toast({
        duration: 3000,
        variant: 'destructive',
        title: 'Not swapping',
        description: 'There was a problem with your request.',
      });
      setIsLoading2(false);
    }
  }

  // Set swap code form submission
  async function onSubmitSwapCode(values: z.infer<typeof setSwapCodeSchema>) {
    setIsLoading(true);
    console.log('let go', values.setswapcode);
    const response = await updateUserSwapCode({ newCode: values.setswapcode });
    if (response) {
      toast({
        duration: 1000,
        variant: 'succes',
        title: 'Loggin succes',
        description: 'Your data is being saved.',
      });
      router.push('/swapUser');
      setIsLoading(false);
    } else {
      toast({
        duration: 3000,
        variant: 'destructive',
        title: 'Email and Password combination incorrect',
        description: 'There was a problem with your request.',
      });
      setIsLoading(false);
    }
  }

  return (
    <section className="current-balance bg-gray-100 p-6 rounded-lg shadow-md">
      <div className="flex flex-col gap-6 items-start w-full">
        <p className="text-lg font-medium">
          {swapUser.firstName} {swapUser.lastName}
        </p>

        {/* Swap Code Form */}
        <Form {...swapForm}>
          <form
            onSubmit={swapForm.handleSubmit(onSubmitSwap)}
            className="flex gap-4 w-full"
          >
            <FormField
              control={swapForm.control}
              name="swapcode"
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormControl>
                    <Input
                      placeholder="Swap code"
                      {...field}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={user.firstName === swapUser.firstName || isLoading2}
              className="form-btn w-36"
            >
              {isLoading2 ? (
                <>
                  <Loader2 size={20} className="animate-spin" /> &nbsp;
                  Loading...
                </>
              ) : (
                'Swap'
              )}
            </Button>
          </form>
        </Form>

        {/* Set Swap Code Form */}
        {swapUser.swapCode === 0 && user.firstName === swapUser.firstName && (
          <Form {...setSwapCodeForm}>
            <form
              onSubmit={setSwapCodeForm.handleSubmit(onSubmitSwapCode)}
              className="flex gap-4 w-full"
            >
              <FormField
                control={setSwapCodeForm.control}
                name="setswapcode"
                render={({ field }) => (
                  <FormItem className="flex-grow">
                    <FormControl>
                      <Input
                        placeholder="Set swap code"
                        {...field}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={isLoading}
                className="form-btn w-36"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" /> &nbsp;
                    Loading...
                  </>
                ) : (
                  'Set Swap Code'
                )}
              </Button>
            </form>
          </Form>
        )}
      </div>
    </section>
  );
};

export default UserBox;
