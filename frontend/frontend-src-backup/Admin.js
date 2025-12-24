import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

export default function Admin() {
  const navigate = useNavigate();

  /* ================= AUTH GUARD ================= */
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) navigate("/admin-login");
  }, [navigate]);

  /* ================= PROJECT STATE ================= */
  const emptyProject = {
    title: "",
    shortDescription: "",
    problemStatement: "",
    solution: "",
    architecture: "",
    impact: "",
    techStack: "",
    githubLink: "",
    liveDemo: "",
    category: "GenAI"
  };

  const [project, setProject] = useState(emptyProject);
  const [projects, setProjects] = useState([]);
  const [editId, setEditId] = useState(null);

  /* ================= TESTIMONIAL STATE ================= */
  const [testimonial, setTestimonial] = useState({
    name: "",
    role: "",
    company: "",
    message: ""
  });

  /* ================= FETCH PROJECTS ================= */
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const res = await fetch("http://localhost:8080/api/projects");
    const data = await res.json();
    setProjects(data);
  };

  /* ================= HANDLERS ================= */
  const handleProjectChange = (e) => {
    setProject({ ...project, [e.target.name]: e.target.value });
  };

  const handleTestimonialChange = (e) => {
    setTestimonial({ ...testimonial, [e.target.name]: e.target.value });
  };

  /* ================= ADD / UPDATE PROJECT ================= */
  const submitProject = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("adminToken");

    const payload = {
      ...project,
      techStack: project.techStack.split(",").map((t) => t.trim())
    };

    const url = editId
      ? `http://localhost:8080/api/projects/${editId}`
      : "http://localhost:8080/api/projects";

    const method = editId ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    alert(editId ? "Project updated ✅" : "Project added ✅");

    setProject(emptyProject);
    setEditId(null);
    fetchProjects();
  };

  /* ================= EDIT PROJECT ================= */
  const editProject = (p) => {
    setProject({
      ...p,
      techStack: p.techStack.join(", ")
    });
    setEditId(p._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ================= DELETE PROJECT ================= */
  const deleteProject = async (id) => {
    if (!window.confirm("Delete this project?")) return;

    const token = localStorage.getItem("adminToken");

    await fetch(`http://localhost:8080/api/projects/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    fetchProjects();
  };

  /* ================= ADD TESTIMONIAL ================= */
  const submitTestimonial = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("adminToken");

    await fetch("http://localhost:8080/api/testimonials", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(testimonial)
    });

    alert("Testimonial added ✅");

    setTestimonial({
      name: "",
      role: "",
      company: "",
      message: ""
    });
  };

  /* ================= LOGOUT ================= */
  const logout = () => {
    localStorage.removeItem("adminToken");
    navigate("/");
  };

  return (
    <div className="container">

      <button style={{ float: "right" }} onClick={logout}>
        Logout
      </button>

      <h1>Admin Dashboard</h1>

      {/* ================= PROJECT FORM ================= */}
      <section className="section-box">
        <h2>{editId ? "Edit Project" : "Add New Project"}</h2>

        <form className="contact-form" onSubmit={submitProject}>
          <input name="title" placeholder="Title" value={project.title} onChange={handleProjectChange} required />
          <input
  name="title"
  placeholder="Project Title"
  value={project.title}
  onChange={handleProjectChange}
  required
/>

<input
  name="tagline"
  placeholder="One-line caption (e.g. Computer vision based proctoring system)"
  value={project.tagline}
  onChange={handleProjectChange}
  required
/>

          <input name="shortDescription" placeholder="Short Description" value={project.shortDescription} onChange={handleProjectChange} />

          <textarea name="problemStatement" placeholder="Problem Statement" value={project.problemStatement} onChange={handleProjectChange} />
          <textarea name="solution" placeholder="Solution" value={project.solution} onChange={handleProjectChange} />
          <textarea name="architecture" placeholder="Architecture / Workflow" value={project.architecture} onChange={handleProjectChange} />
          <textarea name="impact" placeholder="Impact / Results" value={project.impact} onChange={handleProjectChange} />

          <input name="techStack" placeholder="Tech stack (comma separated)" value={project.techStack} onChange={handleProjectChange} />
          <input name="githubLink" placeholder="GitHub link" value={project.githubLink} onChange={handleProjectChange} />
          <input name="liveDemo" placeholder="Live demo link" value={project.liveDemo} onChange={handleProjectChange} />
          <input name="category" placeholder="Category (GenAI / ML / DL)" value={project.category} onChange={handleProjectChange} />

          <button type="submit">
            {editId ? "Update Project" : "Add Project"}
          </button>
        </form>
      </section>

      {/* ================= PROJECT LIST ================= */}
      <section className="section-box">
        <h2>Manage Projects</h2>

        {projects.map((p) => (
          <div key={p._id} style={{ marginBottom: "12px" }}>
            <strong>{p.title}</strong>

            <div style={{ marginTop: "6px" }}>
              <button onClick={() => editProject(p)} style={{ marginRight: "10px" }}>
                Edit
              </button>
              <button onClick={() => deleteProject(p._id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* ================= ADD TESTIMONIAL ================= */}
      <section className="section-box">
        <h2>Add Testimonial</h2>

        <form className="contact-form" onSubmit={submitTestimonial}>
          <input name="name" placeholder="Name" value={testimonial.name} onChange={handleTestimonialChange} required />
          <input name="role" placeholder="Role" value={testimonial.role} onChange={handleTestimonialChange} />
          <input name="company" placeholder="Company" value={testimonial.company} onChange={handleTestimonialChange} />
          <textarea name="message" placeholder="Testimonial message" value={testimonial.message} onChange={handleTestimonialChange} required />
          <button type="submit">Add Testimonial</button>
        </form>
      </section>

    </div>
  );
}
