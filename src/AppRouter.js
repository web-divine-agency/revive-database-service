import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import { app } from "./Server.js";

import Controller from "./controllers/Controller.js";
import DatabaseController from "./controllers/DatabaseController.js";

if (process.env.APP_ENV === "dev") {
  app.use(cors());
}

app.use(bodyParser.json());

const portal = express.Router();
const admin = express.Router();

/**
 * Portal routes
 */
app.use("/portal", portal);
// portal.use(authenticated);
portal.get("/select", DatabaseController.select);


/**
 * Admin routes
 */
app.use("/admin", admin);
// admin.use(authAdmin);
admin.post("/create", DatabaseController.create);

/**
 * Base routes
 */
app.get("/", Controller.base);
