import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { z } from "zod";
import qs from "query-string";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Currency Format Euro (nl-NL, EUR) and Won (ko-KR, KRW)
export function formatAmount(amount: number, user_currency: number = 0): string {
  const currency = user_currency === 0 ? 'EUR' : user_currency === 1 ? 'KRW' : user_currency === 2 ? 'KES' : user_currency === 3 ? 'GBP' : 'USD';
  // const locale = user_currency === 0 ? 'nl-NL' : user_currency === 1 ? 'ko-KR' : user_currency === 2 ? 'ke-KE' : user_currency === 3 ? 'uk-UK' : 'us-US';
  
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits:2,
  }).format(amount);
}
      
export const parseStringify = (value: any) => JSON.parse(JSON.stringify(value));

export const authFormSchema = (type: string) => z.object({
  // Sign up
  firstName: type === 'sign-in' ? z.string().optional() : z.string(),
  lastName: type === 'sign-in' ? z.string().optional() : z.string(),
  currency: type === 'sign-in' ? z.string().optional() : z.string(), 
  // Sign in
  email: z.string().email(),
  password: z.string().min(8),
  // Sign up
  confirmPassword: type === 'sign-in' ? z.string().optional() : z.string().min(8),
  
}).superRefine(({ confirmPassword, password }, ctx) => {
  if (confirmPassword !== password && type !== 'sign-in') {
    ctx.addIssue({
      code: "custom",
      message: "The passwords did not match",
      path: ['confirmPassword']
    });
  }
});

interface UrlQueryParams {
  params: string;
  key: string;
  value: string;
}

export function formUrlQuery({ params, key, value }: UrlQueryParams) {
  const currentUrl = qs.parse(params);

  currentUrl[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
}