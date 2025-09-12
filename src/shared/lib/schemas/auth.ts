import { z } from 'zod'

export const loginSchema = z.object({
    email: z.email('Invalid email'),
    password: z
        .string()
        .min(1, { error: 'Password is required' })
        .min(6, { error: 'Password must be at least 6 characters long' }),
})

export type LoginInputs = z.infer<typeof loginSchema>

export const createNewPasswordSchema = z
    .object({
        newPassword: z
            .string()
            .min(6, 'Password must be at least 6 characters')
            .max(20, 'Password must be at most 20 characters'),
        passwordConfirmation: z.string(),
    })
    .refine(data => data.newPassword === data.passwordConfirmation, {
        message: 'The passwords must match',
        path: ['passwordConfirmation'],
    })

export type CreateNewPasswordInputs = z.infer<typeof createNewPasswordSchema>
export type EmailInputType = Pick<LoginInputs, 'email'>

