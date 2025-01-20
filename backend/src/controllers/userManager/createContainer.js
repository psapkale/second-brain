import { prisma } from "../../db/prisma.js";
import { ContainerZodSchema } from "../../schemaTypes/index.js";

export const createContainer = async (req, res) => {
   const { email } = req.userData;
   const containerSchema = ContainerZodSchema.safeParse(req.body);

   if (!containerSchema.success) {
      return res.status(411).json({
         message: "Invalid input (title required)",
         error: containerSchema.error.errors.map((e) => e.message),
      });
   }

   try {
      const user = await prisma.user.findUnique({
         where: {
            email,
         },
      });

      if (!user) {
         throw new Error("User not found");
      }

      const newContainer = {
         title: containerSchema.data.title,
         isPublic: false,
         creatorId: user.id,
      };

      const container = await prisma.container.create({
         data: {
            ...newContainer,
            posts: {
               create: [],
            },
         },
         include: {
            posts: true,
         },
      });

      if (!container) {
         throw new Error("Container not created");
      }

      res.status(200).json({
         message: "Container created successfully",
         container,
      });
   } catch (err) {
      console.log(err);

      res.status(500).json({
         message: "Error occured while creating container",
         error: {
            err,
            message: err.message,
         },
      });
   }
};
