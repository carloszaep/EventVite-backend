import dotenv from "dotenv";
import { AppError } from "../utils/appError.js";
import Twilio from "twilio";

dotenv.config({ path: "./conf.env" });

const client = Twilio(process.env.twilioSid, process.env.twilioToken);

export const sendSms = async (req, res, next) => {
  try {
    const sms = req.body.sms;

    const sendedSms = await client.messages.create({
      body: sms,
      from: "+18664804472",
      to: "+17866161600",
    });

    res.status(200).json({ ok: "ok", sendedSms });
  } catch (err) {
    next(new AppError(err.message, 404));
  }
};
