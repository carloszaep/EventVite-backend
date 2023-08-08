import z from 'zod'

export const contactsSchema = z.object(
  {
    name: z.string({ required_error: 'name contact is required' }).min(1).max(100),
    phone: z.string({ required_error: 'phone contact is required' }).startsWith('+1').min(12).max(12)
  })

export const validateContact = (input) => {
  return contactsSchema.safeParse(input)
}
