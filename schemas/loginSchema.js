import z from 'zod'

export const loginSchema = z.object(
  {
    token: z.string({ required_error: 'token move be required' }),
    phone: z.string({ required_error: 'phone contact is required' }).startsWith('+1').min(12).max(12)
  })

export const validateLogin = (input) => {
  return loginSchema.safeParse(input)
}

export const phoneSchema = z.object(
  {
    phone: z.string({ required_error: 'phone contact is required' }).startsWith('+1').min(12).max(12)
  })

export const validatePhone = (input) => {
  return phoneSchema.safeParse(input)
}
