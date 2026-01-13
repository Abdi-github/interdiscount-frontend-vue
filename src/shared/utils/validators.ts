import { z } from 'zod';

export const emailSchema = z.string().email('Invalid email address');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters');

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z
  .object({
    first_name: z.string().min(1, 'First name is required'),
    last_name: z.string().min(1, 'Last name is required'),
    email: emailSchema,
    password: passwordSchema,
    password_confirmation: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Passwords do not match',
    path: ['password_confirmation'],
  });

export const addressSchema = z.object({
  label: z.string().optional(),
  street: z.string().min(1, 'Street is required'),
  street_number: z.string().optional(),
  postal_code: z.string().min(4, 'Postal code is required'),
  city: z.string().min(1, 'City is required'),
  canton: z.string().optional(),
  phone: z.string().optional(),
});

export const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  title: z.string().min(1, 'Title is required'),
  body: z.string().min(10, 'Review must be at least 10 characters'),
});

export const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: emailSchema,
  topic: z.string().min(1, 'Topic is required'),
  order_number: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export const changePasswordSchema = z
  .object({
    current_password: z.string().min(1, 'Current password is required'),
    password: passwordSchema,
    password_confirmation: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Passwords do not match',
    path: ['password_confirmation'],
  });
