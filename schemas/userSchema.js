import z from 'zod'

export const userSchema = z.object(
  {
    name: z.string({ required_error: 'name contact is required' }).min(1).max(100),
    phone: z.string({ required_error: 'phone contact is required' }).startsWith('+1').min(12).max(12)
  })

export const validateUser = (input) => {
  return userSchema.safeParse(input)
}

export const partialUserSchema = z.object(
  {
    name: z.string({ required_error: 'name contact is required' }).min(1).max(100)
  })

export const validatePartialUser = (input) => {
  return partialUserSchema.partial().safeParse(input)
}
