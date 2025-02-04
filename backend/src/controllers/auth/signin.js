import { prisma } from "../../db/prisma.js";
import admin from "firebase-admin";

const customSpaceName = (name) => {
   const words = name.split(" ");

   const firstCapitalizedWord =
      words[0].charAt(0).toUpperCase() + words[0].slice(1);

   if (words.length > 1 && words[1].length) {
      const secondCapitalizedWord =
         words[1].charAt(0).toUpperCase() + words[1].slice(1);

      return firstCapitalizedWord + " " + secondCapitalizedWord + "'s space";
   }

   return firstCapitalizedWord + "'s space";
};

export const signin = async (req, res) => {
   const { token } = req.body;

   if (!token) {
      return res.status(411).json({
         message: "Token not provided",
      });
   }

   try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      console.log(decodedToken);

      const { email, name, picture } = decodedToken;

      const existingUser = await prisma.user.findFirst({
         where: { email },
      });

      if (existingUser) {
         throw new Error("User already exists with provided email");
      }

      const newUser = {
         name,
         email,
         imgUrl: !picture
            ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTS-_lB_YIKaaPz_vciNdT2ebnlUl6gJE5kBQ&s"
            : picture,
      };

      const spaceName = customSpaceName(newUser.name);

      const user = await prisma.user.create({
         data: {
            ...newUser,
            containers: {
               create: [
                  {
                     title: spaceName,
                  },
               ],
            },
         },
         include: {
            containers: true,
         },
      });

      if (user) {
         res.status(200).json({
            message: "User created successfully",
            user: {
               name: user.name,
               email: user.email,
               imgUrl: user.imgUrl,
            },
            token,
         });
      }
   } catch (err) {
      console.log(err);

      res.status(500).json({
         message: "Failed to create the user",
         error: { err, message: err.message },
      });
   }
};
