import express from "express";
import cors from "cors";
import { signin } from "./controllers/auth/signin.js";
import { login } from "./controllers/auth/login.js";
import { authMiddleware } from "./controllers/auth/authMiddleware.js";

const app = express();
const apiRouter = express.Router();
const port = 8000;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
   res.send("Second Brain Backend");
});

apiRouter.post("/signin", signin);
apiRouter.post("/login", login);

// TODO protected routes
// TODO get all containers (id)
// TODO get all posts of container (id)
// TODO create container
// TODO create post
// TODO make container public

app.use("/api/v1", apiRouter);

app.listen(port, () => {
   console.log(`Server is running at http://localhost:${port}`);
});
