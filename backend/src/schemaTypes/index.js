import { z } from "zod";

export const UserZodSchema = z.object({
   name: z.string().min(2),
   email: z.string().email(),
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
   contentType: z.enum(["TWITTER", "YOUTUBE", "INSTAGRAM"], {
      message: "contentType should be 'TWITTER' | 'YOUTUBE'",
   }),
});

export const ContainerZodUpdateStatusSchema = z.object({
   toPublic: z.boolean(),
});
