import app from "./app.js";
import dotenv from "dotenv";

dotenv.config({ path: "./config.env" });

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`your app is running on port ${PORT}`);
});
