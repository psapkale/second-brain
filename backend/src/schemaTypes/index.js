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
   imgUrl: z.string().optional(),
});

export const TokenZodSchema = z.string();

export const ContainerZodSchema = z.object({
   title: z.string().min(2, { message: "min 2 letters" }),
});

export const PostZodSchema = z.object({
   title: z.string().min(2, { message: "min 2 letters" }),
   link: z
      .string()
      .min(11, { message: "min 11 letters" })
      .regex(/^https:\/\/[a-zA-Z0-9\-._~:\/?#\[\]@!$&'()*+,;=]+$/, {
         message: "link should be in the form of url",
      }),
   contentType: z.enum(["TWITTER", "YOUTUBE"], {
      message: "contentType should be 'TWITTER' | 'YOUTUBE'",
   }),
});

export const ContainerZodUpdateStatusSchema = z.object({
   toPublic: z.boolean(),
});
