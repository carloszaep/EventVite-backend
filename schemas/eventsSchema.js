import z from 'zod'
import { contactsSchema } from './contactsSchema.js'

export const eventSchema = z.object({
  name: z.string({
    invalid_type_error: 'name most be a string',
    required_error: 'event title is required'
  }).min(1).max(100),
  eventDate: z.coerce.date().min(new Date(), { message: 'time had to be in the future' }),
  contacts: z.array(contactsSchema),
  address: z.string().optional()
})

const partialEventSchema = z.object({
  name: z.string({
    invalid_type_error: 'name most be a string',
    required_error: 'event title is required'
  }).min(1).max(100),
  eventDate: z.coerce.date().min(new Date(), { message: 'time had to be in the future' }),
  address: z.string().optional()
})

export const validateEvent = (input) => {
  return eventSchema.safeParse(input)
}

export const validatePartialEvent = (input) => {
  return partialEventSchema.partial().safeParse(input)
}
