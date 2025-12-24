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
import {
  Routes,
  Route,
  Link,
  Navigate
} from "react-router-dom";

import Admin from "./Admin";
import AdminLogin from "./pages/AdminLogin";
import ProjectDetail from "./pages/ProjectDetail";

import "./App.css";
import profile from "./assets/profile1.png";

/* ================= PROTECTED ROUTE ================= */
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("adminToken");
  if (!token) return <Navigate to="/admin-login" replace />;
  return children;
}

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
    fetch("https://portfolio-backend-alaj.onrender.com/api/projects")
      .then((res) => res.json())
      .then(setProjects)
      .catch(console.error);

    fetch("https://portfolio-backend-alaj.onrender.com/api/testimonials")
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

                {/* SOCIAL ICONS */}
                <div className="social-icons">
                  <a href="https://www.linkedin.com/in/atishay-gangwal-238137168/" target="_blank" rel="noreferrer"><FaLinkedin /></a>
                  <a href="https://github.com/gangwalatishay" target="_blank" rel="noreferrer"><FaGithub /></a>
                  <a href="https://leetcode.com/u/J_atishay/" target="_blank" rel="noreferrer"><SiLeetcode /></a>
                  <a href="https://codeforces.com/profile/j_atishay" target="_blank" rel="noreferrer"><SiCodeforces /></a>
                  <a href="https://www.codechef.com/users/atishay21" target="_blank" rel="noreferrer"><SiCodechef /></a>
                  <a href="mailto:jatishay057@@gmail.com"><FaEnvelope /></a>
                </div>
              </section>

              {/* ABOUT */}
              <section className="section-box">
                <h2>About</h2>
                <p>
                 I’m a builder at heart who thrives on turning "what if" into reality. My journey in tech isn't just about writing code; it’s about connecting the dots between complex Data Engineering, intelligent ML/GenAI solutions, and the Web and Mobile apps that bring them to life. I love the challenge of taking a messy dataset and transforming it into a seamless, AI-driven experience that feels intuitive to the user. To me, the best technology shouldn't feel like a machine—it should feel like a helping hand. Whether I’m architecting a robust backend or fine-tuning a Deep Learning model, my goal is always the same: to build scalable, human-centric tools that solve real-world problems with elegance and purpose.
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
                    <div key={skill} className="skill-card">{skill}</div>
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
                          <Link to={`/projects/${project._id}`}>
                            {project.title}
                          </Link>
                        </h3>

                        {project.tagline && (
                          <p className="project-tagline">{project.tagline}</p>
                        )}
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
                  <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required />
                  <input name="email" value={form.email} onChange={handleChange} placeholder="Email" required />
                  <textarea name="message" value={form.message} onChange={handleChange} placeholder="Message" required />
                  <button type="submit">Send</button>
                </form>
              </section>

            </div>
          }
        />

        {/* PROJECT DETAIL */}
        <Route path="/projects/:id" element={<ProjectDetail />} />

        {/* ADMIN LOGIN */}
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* ADMIN (PROTECTED) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />

      </Routes>

      {/* FOOTER */}
      <footer className="footer">
        <span
          className="footer-secret"
          onDoubleClick={() => (window.location.href = "/admin-login")}
        >
          © 2025 Atishay
        </span>
      </footer>
    </>
  );
}
