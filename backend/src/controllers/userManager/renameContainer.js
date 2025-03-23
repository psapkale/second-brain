import { prisma } from "../../db/prisma.js";
import { validateOwner } from "../auth/validateOwner.js";

export const renameContainer = async (req, res) => {
   const { containerId } = req.params;
   const { title } = req.body;

   if (title?.length <= 2) {
      return res.status(411).json({
         message: "Title is too short",
      });
   }

   try {
      let container = await prisma.container.findUnique({
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

      container = await prisma.container.update({
         where: {
            id: containerId,
         },
         data: {
            title,
         },
      });

      if (!container) {
         throw new Error("Failed to rename container");
      }

      res.status(200).json({
         message: "Container renamed successfully",
         container,
      });
   } catch (err) {
      console.log(err);

      res.status(500).json({
         message: "Error occured while renaming container",
         error: {
            err,
            message: err.message,
         },
      });
   }
};
