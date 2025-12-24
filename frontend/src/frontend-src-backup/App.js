import {
  FaLinkedin,
  FaGithub,
  FaEnvelope
} from "react-icons/fa";

import {
  SiLeetcode,
  SiCodeforces,
  SiCodechef
} from "react-icons/si";

import { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";

import Admin from "./Admin";
import AdminLogin from "./pages/AdminLogin";
import ProjectDetail from "./pages/ProjectDetail";

import "./App.css";
// import profile from "./assets/profile1.png";

export default function App() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: ""
  });

  const [projects, setProjects] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("https://portfolio-backend-alaj.onrender.com/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    const data = await response.json();
    alert(data.message);
    setForm({ name: "", email: "", message: "" });
  };

  useEffect(() => {
    fetch("http://localhost:8080/api/projects")
      .then((res) => res.json())
      .then(setProjects)
      .catch(console.error);

    fetch("http://localhost:8080/api/testimonials")
      .then((res) => res.json())
      .then(setTestimonials)
      .catch(console.error);
  }, []);

  return (
    <>
      <Routes>

        {/* ================= HOME ================= */}
        <Route
          path="/"
          element={
            <div className="container">

              {/* NAVBAR */}
              <nav className="navbar">
                <span className="logo">Atishay</span>

                <div className="nav-links">
                  <a href="#projects">Projects</a>
                  <a href="#contact">Contact</a>
                  <a
                    href="/resume.pdf"
                    target="_blank"
                    rel="noreferrer"
                    className="resume-btn"
                  >
                    Resume
                  </a>
                </div>
              </nav>

              {/* HERO */}
              <section className="hero">
                <img src={profile} alt="Atishay" className="profile-img" />
                <h1>Atishay</h1>
                <p className="hero-subtitle">
                  Generative AI & Machine Learning Engineer
                </p>

                {/* SOCIAL LINKS */}
                <div className="social-links">
                  <a href="https://www.linkedin.com/in/YOUR_LINK" target="_blank" rel="noreferrer">LinkedIn</a>
                  <a href="https://github.com/YOUR_GITHUB" target="_blank" rel="noreferrer">GitHub</a>
                  <a href="https://leetcode.com/YOUR_ID" target="_blank" rel="noreferrer">LeetCode</a>
                  <a href="https://codeforces.com/profile/YOUR_ID" target="_blank" rel="noreferrer">Codeforces</a>
                  <a href="https://www.codechef.com/users/YOUR_ID" target="_blank" rel="noreferrer">CodeChef</a>
                  <a href="mailto:YOUR_EMAIL@gmail.com">Email</a>
                </div>
              </section>

              {/* ABOUT */}
              <section className="section-box">
                <h2>About</h2>
                <p>
                  I design and build scalable full-stack applications with a strong
                  focus on ML, GenAI, and production deployment.
                </p>
              </section>

              {/* SKILLS */}
              <section className="section-box">
                <h2>Skills</h2>
                <div className="skills-grid">
                  {[
                    "Generative AI (LLMs, RAG)",
                    "Machine Learning",
                    "Deep Learning (CNNs, Vision)",
                    "Python",
                    "React",
                    "Node.js / Express",
                    "FastAPI",
                    "MongoDB",
                    "Docker",
                    "AWS"
                  ].map(skill => (
                    <div key={skill} className="skill-card">
                      {skill}
                    </div>
                  ))}
                </div>
              </section>

              {/* PROJECTS */}
              <section id="projects" className="section-box">
                <h2>Projects</h2>

                <div className="project-grid">
                  {projects.length === 0 ? (
                    <p>No projects added yet.</p>
                  ) : (
                    projects.map((project) => (
                      <div className="project-card" key={project._id}>
                        <h3>
                          <Link to={`/projects/${project._id}`} className="link">
                            {project.title}
                          </Link>
                        </h3>

                        {project.tagline && (
                          <p className="project-tagline">
                            {project.tagline}
                          </p>
                        )}

                        <p>{project.description}</p>
                      </div>
                    ))
                  )}
                </div>
              </section>

              {/* TESTIMONIALS */}
              <section className="section-box">
                <h2>Testimonials</h2>

                {testimonials.length === 0 ? (
                  <p>No testimonials yet.</p>
                ) : (
                  testimonials.map((t) => (
                    <div key={t._id || t.name} className="testimonial-card">
                      <p>“{t.message}”</p>
                      <strong>{t.name}</strong>
                    </div>
                  ))
                )}
              </section>

              {/* CONTACT */}
              <section id="contact" className="section-box">
                <h2>Contact</h2>

                <form className="contact-form" onSubmit={handleSubmit}>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Name"
                    required
                  />
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email"
                    required
                  />
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Message"
                    required
                  />
                  <button type="submit">Send</button>
                </form>
              </section>

            </div>
          }
        />

        {/* PROJECT DETAIL */}
        <Route path="/projects/:id" element={<ProjectDetail />} />

        {/* ADMIN */}
        <Route path="/admin" element={<Admin />} />

        {/* ADMIN LOGIN */}
        <Route path="/admin-login" element={<AdminLogin />} />

      </Routes>

      {/* FOOTER */}
      <footer className="footer">
        <span
          className="footer-secret"
          title="© Atishay"
          onDoubleClick={() => (window.location.href = "/admin-login")}
        >
          © 2025 Atishay
        </span>
      </footer>
    </>
  );
}
