import { prisma } from "../../db/prisma.js";

export const getAllPosts = async (req, res) => {
   const { containerId } = req.params;

   try {
      const container = await prisma.container.findUnique({
         where: {
            id: containerId,
         },
         include: {
            posts: true,
         },
      });

      if (!container) {
         throw new Error("Container not found");
      }

      res.status(200).json({
         message: `All post of '${container.title}'`,
         posts: container.posts,
      });
   } catch (err) {
      console.log(err);

      res.status(500).json({
         message: "Error fetching posts",
         error: {
            err,
            message: err.message,
         },
      });
   }
};
