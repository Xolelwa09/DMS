require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const documentRoutes = require("./routes/documentRoutes");
const statsRoutes = require("./routes/statsRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/stats", statsRoutes);

app.get("/", (req, res) => {
  res.send("Document Management API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});