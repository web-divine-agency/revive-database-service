import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import { app } from "./Server.js";

import { authenticated } from "./middleware/auth.js";

import Controller from "./controllers/Controller.js";
import DatabaseController from "./controllers/DatabaseController.js";

if (process.env.APP_ENV === "dev") {
  app.use(cors());
}

app.use(bodyParser.json());

const database = express.Router();

app.use("/db", database);
database.use(authenticated);
database.get("/select", DatabaseController.select);
database.post("/create", DatabaseController.create);
database.put("/update", DatabaseController.update);
database.delete("/delete", DatabaseController.delete);

/**
 * Base routes
 */
app.get("/", Controller.base);
app.get("/user", DatabaseController.user);
