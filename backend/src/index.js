import express from "express";
import cors from "cors";
import { signin } from "./controllers/auth/signin.js";
import { login } from "./controllers/auth/login.js";
import { authMiddleware } from "./controllers/auth/authMiddleware.js";
import { getAllContainers } from "./controllers/userManager/getAllContainers.js";
import { createContainer } from "./controllers/userManager/createContainer.js";
import { getAllPosts } from "./controllers/containerManager/getAllPosts.js";
import { createPost } from "./controllers/containerManager/createPost.js";
import { updatePublicStatusOfContainer } from "./controllers/userManager/updatePublicStatusOfContainer.js";

const app = express();
const apiRouter = express.Router();
const port = 8080;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
   res.send("Second Brain Backend");
});

apiRouter.post("/signin", signin);
apiRouter.post("/login", login);

// TODO protected routes

// TODO get all containers (id)
apiRouter.get("/containers", authMiddleware, getAllContainers);

// TODO create container
apiRouter.post("/create-container", authMiddleware, createContainer);

// TODO get all posts of container (id)
apiRouter.get("/:containerId/posts", authMiddleware, getAllPosts);

// TODO create post
apiRouter.post("/:containerId/create-post", authMiddleware, createPost);

// TODO make container public
apiRouter.post(
   "/:containerId/toPublic",
   authMiddleware,
   updatePublicStatusOfContainer
);

app.use("/api/v1", apiRouter);

app.listen(port, () => {
   console.log(`Server is running at http://localhost:${port}`);
});
