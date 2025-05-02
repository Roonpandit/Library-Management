import dotenv from "dotenv";
import app from "./app";
import connectDB from "./config/db";
import cors from "cors";

dotenv.config();

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",");

const corsOptions = {
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
