const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: String,

    tagline: String, // 👈 NEW (one-line caption)

    description: String,
    shortDescription: String,
    problemStatement: String,
    solution: String,
    architecture: String,
    impact: String,

    techStack: [String],
    githubLink: String,
    liveDemo: String,
    category: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
