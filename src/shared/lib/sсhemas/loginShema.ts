import { z } from 'zod'

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
      message: 'Password must contain special characters',
    })
    .regex(/[0-9]/, 'Must contain number (0-9)')
    .regex(/[a-z]/, 'Must contain lowercase letter (a-z)')
    .regex(/[A-Z]/, 'Must contain uppercase letter (A-Z)'),
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
export type LoginFormData = z.infer<typeof loginSchema>
