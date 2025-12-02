import express, { Request, Response } from "express";

const app = express();
const port = 8080;

app.get("/", (req: Request, res: Response) => {
  res.send("hello welcome");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
