import express from "express";

const router = express.Router();

router.route("/sendSms").get((req, res, next) => {
  res.status(200).json({ ok: "hello" });
});

export default router;
