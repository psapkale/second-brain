import express from "express";
import cors from "cors";
import { signin } from "./controllers/auth/signin.js";
import { login } from "./controllers/auth/login.js";

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

app.use("/api/v1", apiRouter);

app.listen(port, () => {
   console.log(`Server is running at http://localhost:${port}`);
});
