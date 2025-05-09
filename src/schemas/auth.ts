import {z} from 'zod'

export const loginSchema = z.object({
    username: z.string().min(1, {
        message: "Username can't be empty"
    }),
    password: z.string()
                .min(4, {message: "Password must be at least 4 characters long"})
})

export type LoginData = z.infer<typeof loginSchema>

export const changePasswordSchema = z.object({
    old_password: z.string().min(4, {
        message: "Old password can't be empty"
    }),
    new_password: z.string()
                .min(4, {message: "New password must be at least 4 characters long"})
})

export type ChangePasswordData = z.infer<typeof changePasswordSchema>