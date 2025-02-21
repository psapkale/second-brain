import { prisma } from "../../db/prisma.js";

export const getSharedContainer = async (req, res) => {
   const { containerId } = req.params;

   try {
      const container = await prisma.container.findUnique({
         where: {
            id: containerId,
         },
         include: {
            creator: true,
            posts: true,
         },
      });

      if (!container) {
         throw new Error("Container not found");
      }

      if (!container.isPublic) {
         throw new Error("Container is not public");
      }

      res.status(200).json({
         message: "Container found successfully",
         container,
      });
   } catch (err) {
      console.log(err);

      res.status(500).json({
         message: "Error occured while fetching container",
         error: {
            err,
            message: err.message,
         },
      });
   }
};
