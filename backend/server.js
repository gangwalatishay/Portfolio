require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const Project = require("./models/Project");
const Testimonial = require("./models/Testimonial");
const Contact = require("../models/Contact");

const app = express();
const PORT = process.env.PORT || 8080;

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;
const JWT_SECRET = process.env.JWT_SECRET;


/* ================= MIDDLEWARE ================= */
app.use(cors());
app.use(express.json());

/* ================= MONGODB ================= */
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB Atlas connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));



/* ================= ROOT ================= */
app.get("/", (req, res) => {
  res.send("Backend running successfully 🚀");
});

/* ================= AUTH MIDDLEWARE ================= */
const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(403).json({ message: "No token provided" });
  }

  try {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
console.log("ADMIN_EMAIL:", process.env.ADMIN_EMAIL);
console.log("ADMIN_PASSWORD_HASH:", process.env.ADMIN_PASSWORD_HASH);

/* ================= ADMIN LOGIN ================= */
app.post("/api/admin/login", async (req, res) => {
  const { email, password } = req.body;

  if (email !== ADMIN_EMAIL) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isValid = bcrypt.compareSync(password, ADMIN_PASSWORD_HASH);
  if (!isValid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ role: "admin" }, JWT_SECRET, {
    expiresIn: "2h"
  });

  res.json({ token });
});

/* =================================================
   PROJECT ROUTES
================================================= */

/* GET all projects (PUBLIC) */
app.get("/api/projects", async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* GET single project (PUBLIC) */
app.get("/api/projects/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json(project);
  } catch {
    res.status(400).json({ message: "Invalid project ID" });
  }
});

/* ADD project (ADMIN ONLY) */
app.post("/api/projects", authenticateAdmin, async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.json({ success: true, project });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* UPDATE project (ADMIN ONLY) */
app.put("/api/projects/:id", authenticateAdmin, async (req, res) => {
  try {
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(updatedProject);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* DELETE project (ADMIN ONLY) */
app.delete("/api/projects/:id", authenticateAdmin, async (req, res) => {
  try {
    const deleted = await Project.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({ success: true, message: "Project deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =================================================
   TESTIMONIAL ROUTES
================================================= */

/* GET testimonials (PUBLIC) */
app.get("/api/testimonials", async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ADD testimonial (ADMIN ONLY) */
app.post("/api/testimonials", authenticateAdmin, async (req, res) => {
  try {
    const testimonial = new Testimonial(req.body);
    await testimonial.save();
    res.json({ success: true, testimonial });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* DELETE testimonial (ADMIN ONLY) */
app.delete("/api/testimonials/:id", authenticateAdmin, async (req, res) => {
  try {
    const deleted = await Testimonial.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Testimonial not found" });
    }

    res.json({ success: true, message: "Testimonial deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
/* ================= CONTACT ================= */
app.post("/api/contact", async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();
    res.json({ message: "Message received successfully ✅" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



/* ================= SERVER ================= */
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
 