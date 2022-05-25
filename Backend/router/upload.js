import express from "express";
import {
  uploadFile,
  uploadProfile,
  uploadInvoice,
  uploadCV,
  uploadAppointment
} from "../controller/upload.js";

export const upload = express.Router();

upload.post("/", uploadFile);

upload.post("/profile", uploadProfile);

upload.post("/cv", uploadCV);

upload.post("/appointment", uploadAppointment);

upload.post("/invoice", uploadInvoice);

//404
upload.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!");
});
