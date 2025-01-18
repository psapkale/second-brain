import { hash } from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../../db/prisma.js";
import { UserZodSchema } from "../../schemaTypes/index.js";

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
   const userSchema = UserZodSchema.safeParse(req.body);

   if (!userSchema.success) {
      return res.status(411).json({
         message: "Invalid input (name, email and password are required)",
         error: userSchema.error.errors.map((e) => e.message),
      });
   }

   try {
      const existingUser = await prisma.user.findFirst({
         where: {
            email: userSchema.data.email,
         },
      });

      if (existingUser) {
         throw new Error("User already exists with provided email");
      }

      const hashedPassword = await hash(userSchema.data.password, 10);

      const newUser = {
         name: userSchema.data.name,
         email: userSchema.data.email,
         password: hashedPassword,
         imgUrl: !userSchema.data.imgUrl
            ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTS-_lB_YIKaaPz_vciNdT2ebnlUl6gJE5kBQ&s"
            : userSchema.data.imgUrl,
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
         const token = jwt.sign(
            { email: user.email, name: user.name },
            process.env.JWT_SECRET
         );
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
