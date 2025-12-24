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

  /* ================= PROJECT STATE (UNCHANGED) ================= */
  const emptyProject = {
    title: "",
    tagline: "",
    shortDescription: "",
    problemStatement: "",
    solution: "",
    architecture: "",
    impact: "",
    techStack: "",
    githubLink: "",
    liveDemo: "",
    category: "GenAI",
    architectureImage: "",
    screenshots: "",
    metrics: { accuracy: "", latency: "", users: "" }
  };

  const [project, setProject] = useState(emptyProject);
  const [projects, setProjects] = useState([]);
  const [editId, setEditId] = useState(null);

  /* ================= TESTIMONIAL STATE ================= */
  const emptyTestimonial = {
    name: "",
    role: "",
    company: "",
    message: ""
  };

  const [testimonial, setTestimonial] = useState(emptyTestimonial);
  const [testimonials, setTestimonials] = useState([]);
  const [editTestimonialId, setEditTestimonialId] = useState(null);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    fetchProjects();
    fetchTestimonials();
  }, []);

  const fetchProjects = async () => {
    const res = await fetch("https://portfolio-backend-alaj.onrender.com/api/projects");
    setProjects(await res.json());
  };

  const fetchTestimonials = async () => {
    const res = await fetch("https://portfolio-backend-alaj.onrender.com/api/testimonials");
    setTestimonials(await res.json());
  };

  /* ================= HANDLERS ================= */
  const handleProjectChange = (e) => {
    setProject({ ...project, [e.target.name]: e.target.value });
  };

//   const handleMetricChange = (e) => {
//     setProject({
//       ...project,
//       metrics: { ...project.metrics, [e.target.name]: e.target.value }
//     });
//   };

  const handleTestimonialChange = (e) => {
    setTestimonial({ ...testimonial, [e.target.name]: e.target.value });
  };

  /* ================= PROJECT CRUD (UNCHANGED) ================= */
  const submitProject = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("adminToken");

    const payload = {
      ...project,
      techStack: project.techStack
        ? project.techStack.split(",").map(t => t.trim())
        : [],
      screenshots: project.screenshots
        ? project.screenshots.split(",").map(s => s.trim())
        : []
    };

    const url = editId
      ? `https://portfolio-backend-alaj.onrender.com/api/projects/${editId}`
      : "https://portfolio-backend-alaj.onrender.com/api/projects";

    await fetch(url, {
      method: editId ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    setProject(emptyProject);
    setEditId(null);
    fetchProjects();
  };

  const editProject = (p) => {
    setProject({
      ...p,
      techStack: p.techStack?.join(", "),
      screenshots: p.screenshots?.join(", "),
      metrics: p.metrics || { accuracy: "", latency: "", users: "" }
    });
    setEditId(p._id);
  };

  const deleteProject = async (id) => {
    const token = localStorage.getItem("adminToken");
    await fetch(`https://portfolio-backend-alaj.onrender.com/api/projects/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchProjects();
  };

  /* ================= TESTIMONIAL CRUD ================= */

  const submitTestimonial = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("adminToken");

    /* EDIT = delete old + add new */
    if (editTestimonialId) {
      await deleteTestimonial(editTestimonialId);
    }

    await fetch("https://portfolio-backend-alaj.onrender.com/api/testimonials", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(testimonial)
    });

    setTestimonial(emptyTestimonial);
    setEditTestimonialId(null);
    fetchTestimonials();
  };

  const editTestimonial = (t) => {
    setTestimonial(t);
    setEditTestimonialId(t._id);
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  const deleteTestimonial = async (id) => {
    const token = localStorage.getItem("adminToken");
    await fetch(`https://portfolio-backend-alaj.onrender.com/api/testimonials/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchTestimonials();
  };
    const [messages, setMessages] = useState([]);

    const fetchMessages = async () => {
  const token = localStorage.getItem("adminToken");

  const res = await fetch("https://portfolio-backend-alaj.onrender.com/api/contact", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const data = await res.json();
  setMessages(data);
};

useEffect(() => {
  fetchMessages();
}, []);

const deleteMessage = async (id) => {
  const token = localStorage.getItem("adminToken");

  await fetch(`https://portfolio-backend-alaj.onrender.com/api/contact/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  fetchMessages();
};
<section className="section-box">
  <h2>Contact Messages</h2>

  {messages.length === 0 && <p>No messages yet.</p>}

  {messages.map((m) => (
    <div key={m._id} className="testimonial-card">
      <p><strong>Name:</strong> {m.name}</p>
      <p><strong>Email:</strong> {m.email}</p>
      <p>{m.message}</p>

      <button
        className="btn secondary"
        onClick={() => deleteMessage(m._id)}
      >
        Delete
      </button>
    </div>
  ))}
</section>


  /* ================= LOGOUT ================= */
  const logout = () => {
    localStorage.removeItem("adminToken");
    navigate("/");
  };

  /* ================= UI ================= */
  return (
    <div className="container admin">

      <button className="btn secondary" style={{ float: "right" }} onClick={logout}>
        Logout
      </button>

      <h1>Admin Dashboard</h1>

      {/* ================= PROJECT FORM ================= */}
      <section className="section-box">
        <h2>{editId ? "Edit Project" : "Add Project"}</h2>
        <form className="contact-form" onSubmit={submitProject}>
          <input name="title" placeholder="Project Title" value={project.title} onChange={handleProjectChange} required />
          <input name="tagline" placeholder="Tagline" value={project.tagline} onChange={handleProjectChange} />
          <textarea name="shortDescription" placeholder="Short Description" value={project.shortDescription} onChange={handleProjectChange} />
          <textarea name="problemStatement" placeholder="Problem" value={project.problemStatement} onChange={handleProjectChange} />
          <textarea name="solution" placeholder="Solution" value={project.solution} onChange={handleProjectChange} />
          <textarea name="architecture" placeholder="Architecture" value={project.architecture} onChange={handleProjectChange} />
          <textarea name="impact" placeholder="Impact" value={project.impact} onChange={handleProjectChange} />
          <input name="techStack" placeholder="Tech stack" value={project.techStack} onChange={handleProjectChange} />
          <button className="btn">{editId ? "Update" : "Add"} Project</button>
        </form>
      </section>

      {/* ================= PROJECT LIST ================= */}
      <section className="section-box">
        <h2>Projects</h2>
        {projects.map(p => (
          <div key={p._id} style={{ marginBottom: 12 }}>
            <strong>{p.title}</strong>
            <div>
              <button className="btn secondary" onClick={() => editProject(p)}>Edit</button>
              <button className="btn" onClick={() => deleteProject(p._id)}>Delete</button>
            </div>
          </div>
        ))}
      </section>

      {/* ================= TESTIMONIAL CRUD ================= */}
      <section className="section-box">
        <h2>{editTestimonialId ? "Edit Testimonial" : "Add Testimonial"}</h2>

        <form className="contact-form" onSubmit={submitTestimonial}>
          <input name="name" placeholder="Name" value={testimonial.name} onChange={handleTestimonialChange} required />
          <input name="role" placeholder="Role" value={testimonial.role} onChange={handleTestimonialChange} />
          <input name="company" placeholder="Company" value={testimonial.company} onChange={handleTestimonialChange} />
          <textarea name="message" placeholder="Message" value={testimonial.message} onChange={handleTestimonialChange} required />
          <button className="btn">{editTestimonialId ? "Update" : "Add"} Testimonial</button>
        </form>

        <hr />

        {testimonials.map(t => (
          <div key={t._id} className="testimonial-card">
            <p>“{t.message}”</p>
            <strong>{t.name}</strong>
            <div>
              <button className="btn secondary" onClick={() => editTestimonial(t)}>Edit</button>
              <button className="btn" onClick={() => deleteTestimonial(t._id)}>Delete</button>
            </div>
          </div>
        ))}
      </section>

    </div>
  );
}
