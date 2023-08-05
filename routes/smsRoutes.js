import express from "express";
import { sendSms } from "../controllers/smsController.js";

const router = express.Router();

router.route("/sendSms").post(sendSms);

export default router;
