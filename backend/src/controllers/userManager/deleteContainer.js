import { prisma } from "../../db/prisma.js";
import { validateOwner } from "../auth/validateOwner.js";

export const deleteContainer = async (req, res) => {
   const { email } = req.userData;
   const { containerId } = req.params;

   if (!containerId) {
      throw new Error("container id not provided in the url");
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

      let container = await prisma.container.findUnique({
         where: {
            id: containerId,
            creator: user,
         },
      });

      if (!container) {
         throw new Error("Container not found");
      }

      // delete posts of container
      const posts = await prisma.post.deleteMany({
         where: {
            parentContainerId: containerId,
         },
      });

      if (!posts) {
         throw new Error("Failed to delete posts of container");
      }

      container = await prisma.container.delete({
         where: {
            id: containerId,
         },
      });

      if (!container) {
         throw new Error("Failed to delete container");
      }

      const notOwnerErr = await validateOwner(req, container.creatorId);

      if (notOwnerErr) {
         throw notOwnerErr;
      }

      res.status(200).json({
         message: "Container deleted successfully",
         container,
      });
   } catch (err) {
      console.log(err);

      res.status(500).json({
         message: "Error occured while deleting container",
         error: {
            err,
            message: err.message,
         },
      });
   }
};
