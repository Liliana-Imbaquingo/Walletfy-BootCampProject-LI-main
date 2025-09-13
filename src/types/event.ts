import { z } from 'zod'

export const EventSchema = z.object({
  id: z.string().uuid(),
  name: z.string().nonempty("Name field empty").max(20, "Name must have max 20 characters!"),
  description: z.string().max(100, "Description must have max 100 characters!").optional(),
  amount: z.number().positive("Amount must be a positive number!").gt(0, "Amount must be greater than 0") ,
  date: z.string(),
  type: z.enum(['Expense', 'Income']),
})

export type EventType = z.infer<typeof EventSchema>

export const CreateEventSchema = EventSchema.omit({
  id: true,
})

export type CreateEventType = z.infer<typeof CreateEventSchema>

export const UpdateEventSchema = EventSchema.partial().extend({
  id: z.string(),
})

export type UpdateEventType = z.infer<typeof UpdateEventSchema>
