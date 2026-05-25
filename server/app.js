import express from "express";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: "https://nutrio-admin.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());
// routes
app.get("/", (req, res) => res.send("API running ✅"));


import userRoutes from "./routes/user.routes.js";
import providerRoutes from "./routes/provider.routes.js";


app.use("/api/providers", providerRoutes);
app.use("/api/users", userRoutes);


// Error handling middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal server error";
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
});

export { app };
