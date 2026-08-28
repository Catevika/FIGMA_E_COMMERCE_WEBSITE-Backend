import "dotenv/config";
import { cyan, yellow } from "console-log-colors";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import { corsOptions } from "./config/corsOptions.js";
import { dbConnect } from "./config/dbConnect.js";
import { credentials } from "./middlewares/credentials.js";
import { verifyJWT } from "./middlewares/verifyJWT.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();

if (!process.env.VERCEL) {
	app.listen(process.env.EXPRESS_PORT || 5000, () =>
		console.log(
			yellow(`Server running on port ${process.env.EXPRESS_PORT || 5000}`)
		)
	);
}

await dbConnect();

mongoose.connection.on("connected", () => {
	console.log(cyan("MongoDB connected successfully"));
});

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

app.get("/health", (req, res) => {
	res.status(200).json({ status: "ok" });
});

app.get("/", (req, res) => {
	res.status(200).json({ status: "ok", service: "backend" });
});

app.use("/", userRoutes);
app.use("/api", userRoutes);

app.use(verifyJWT);

if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}

process.on("uncaughtException", (error) => {
	console.log(error);
});

export default app;
