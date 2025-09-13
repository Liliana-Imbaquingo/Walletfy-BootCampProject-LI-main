import { z } from "zod";


export const StoreSchema = z.object({
role: z.enum(['user', 'admin']),
theme: z.enum(['light', 'dark']),
setTheme: z
.function()
.args(z.enum(['light', 'dark']))
.returns(z.void()),
})

export type StoreType = z.infer<typeof StoreSchema>