import { prisma } from "../../db/prisma.js";
import { ContainerZodUpdateStatusSchema } from "../../schemaTypes/index.js";
import { validateOwner } from "../auth/validateOwner.js";

export const updatePublicStatusOfContainer = async (req, res) => {
   const { email } = req.userData;
   const { containerId } = req.params;
   const updateStatusSchema = ContainerZodUpdateStatusSchema.safeParse(
      req.body
   );

   if (!updateStatusSchema.success) {
      return res.status(411).json({
         message: "Invalid format (toPublic required)",
         error: updateStatusSchema.error.errors.map((e) => e.message),
      });
   }

   try {
      const container = await prisma.container.findUnique({
         where: {
            id: containerId,
         },
      });

      if (!container) {
         throw new Error("Container not found");
      }

      const notOwnerErr = validateOwner(req, container.creatorId);

      if (notOwnerErr) {
         throw await notOwnerErr;
      }

      const updatedContainer = await prisma.container.update({
         where: {
            id: container.id,
         },
         data: {
            isPublic: updateStatusSchema.data.toPublic,
         },
      });

      if (!updatedContainer) {
         throw new Error(
            `Failed to make ${container.name} ${
               updateStatusSchema.data.toPublic ? "Public" : "Private"
            }`
         );
      }

      res.status(200).json({
         message: "Container updated successfully",
         updatedContainer,
      });
   } catch (err) {
      console.log(err);

      res.status(500).json({
         message: "Error occured while updating container",
         error: {
            err,
            message: err.message,
         },
      });
   }
};
