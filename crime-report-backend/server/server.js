const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const bcrypt = require("bcrypt");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure file uploads
const upload = multer({ dest: "uploads/" });

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/crimeReporting", { useNewUrlParser: true, useUnifiedTopology: true });

// Define schemas
const reportSchema = new mongoose.Schema({
  reporterName: String,
  category: String,
  description: String,
  location: String,
  date: String,
  time: String,
  imagePath: String,
  videoPath: String,
  audioPath: String,
});

const adminSchema = new mongoose.Schema({
  username: String,
  password: String, // Store hashed passwords
});

// Create models
const Report = mongoose.model("Report", reportSchema);
const Admin = mongoose.model("Admin", adminSchema);

// Seed admin account (run once)
(async () => {
  const adminExists = await Admin.findOne({ username: "admin" });
  if (!adminExists) {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await Admin.create({ username: "admin", password: hashedPassword });
    console.log("Admin account created!");
  }
})();

// API endpoints
app.post("/api/report-crime", upload.fields([{ name: "image" }, { name: "video" }, { name: "audio" }]), async (req, res) => {
  try {
    const report = new Report({
      reporterName: req.body.reporterName,
      category: req.body.crimeCategory,
      description: req.body.crimeDescription,
      location: req.body.location,
      date: req.body.date,
      time: req.body.time,
      imagePath: req.files?.image?.[0]?.path,
      videoPath: req.files?.video?.[0]?.path,
      audioPath: req.files?.audio?.[0]?.path,
    });
    await report.save();
    res.status(201).json({ message: "Report submitted successfully!" });
  } catch (error) {
    console.error("Error saving report:", error);
    res.status(500).json({ message: "Failed to submit report." });
  }
});

app.post("/api/admin-login", async (req, res) => {
  const { username, password } = req.body;
  const admin = await Admin.findOne({ username });

  if (admin && (await bcrypt.compare(password, admin.password))) {
    res.status(200).json({ message: "Login successful!" });
  } else {
    res.status(401).json({ message: "Invalid credentials!" });
  }
});

app.get("/api/reports", async (req, res) => {
  try {
    const reports = await Report.find({});
    res.status(200).json(reports);
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ message: "Failed to fetch reports." });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
