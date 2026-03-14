import {z} from "zod";
export const baseUserSchema = z.object({
  name: z.string().min(2),
  role: z.enum(["STAFF", "CONVENER","ADMIN"]),
  email: z.string().email(),
  password: z.string().min(6),
  mobile: z.string().regex(/^\d{10}$/, "Mobile number must be 10 digits").optional()

});