import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Currency Format Euro (nl-NL, EUR) and Won (ko-KR, KRW)
export function formatAmount(amount: number, currency: string = 'EUR'): string {
  const locale = currency==='EUR' ? 'nl-NL' : 'ko-KR';
  
  return new Intl.NumberFormat(locale, {
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