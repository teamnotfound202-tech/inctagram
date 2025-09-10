import { z } from 'zod';

export const loginSchema = z.object({
    email: z
        .string()
        .min(1, 'Enter your email')
        .email('The email must match the format example@example.com'),

    password: z
        .string()
        .min(1, 'Enter your password')
        .min(6, 'Minimum number of characters 6')
        .max(20, 'Maximum number of characters 20')
        .regex(/^[A-Za-z0-9!"#$%&'()*+,-.\/:;<=>?@[\]^_`{|}~]+$/, {
            message: 'Password must contain special characters'
        })
        .regex(/[0-9]/, 'Must contain number (0-9)')
        .regex(/[a-z]/, 'Must contain lowercase letter (a-z)')
        .regex(/[A-Z]/, 'Must contain uppercase letter (A-Z)')
});

export type LoginFormData = z.infer<typeof loginSchema>;