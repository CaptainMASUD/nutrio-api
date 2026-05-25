import express from "express";
import cors from "cors";

const app = express();

const corsOptions = {
  origin: ["https://nutrio-admin.vercel.app"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

// Handle preflight requests
app.options("*", cors(corsOptions));

app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("API running ✅");
});

import userRoutes from "./routes/user.routes.js";
import providerRoutes from "./routes/provider.routes.js";

app.use("/api/providers", providerRoutes);
app.use("/api/users", userRoutes);

// Error middleware
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal server error"
  });
});

export { app };