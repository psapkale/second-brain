import { z } from "zod";

export const UserZodSchema = z.object({
   name: z.string().min(2),
   email: z.string().email(),
   password: z
      .string()
      .min(8, { message: "min 8 letters" })
      .max(20, { message: "max 20 letters" })
      .regex(/\W/, { message: "must contain a special character" })
      .regex(/[A-Z]/, { message: "must contain an uppercase letter" })
      .regex(/[a-z]/, { message: "must contain a lowercase letter" }),
   imgUrl: z.string(),
});
