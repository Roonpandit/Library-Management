import express from "express";
import cors from "cors";
import path from "path";
import authRoutes from "./routes/authRoutes";
import bookRoutes from "./routes/bookRoutes";
import borrowRoutes from "./routes/borrowRoutes";
import userRoutes from "./routes/userRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import { notFound, errorHandler } from "./middleware/errorMiddleware";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/borrow", borrowRoutes);
app.use("/api/users", userRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
