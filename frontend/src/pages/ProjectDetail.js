import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "../App.css";

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://portfolio-backend-alaj.onrender.com/api/projects/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProject(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="container">Loading...</p>;
  if (!project) return <p className="container">Project not found.</p>;

  const { metrics = {} } = project;

  return (
    <div className="container project-detail">

      {/* ================= BACK ================= */}
      <Link to="/" className="btn secondary" style={{ marginBottom: "32px", display: "inline-block" }}>
        ← Back to Home
      </Link>

      {/* ================= HERO ================= */}
      <section className="project-hero">
        <h1>{project.title}</h1>

        {project.tagline && (
          <p className="project-hero-tagline">{project.tagline}</p>
        )}

        {(project.githubLink || project.liveDemo) && (
          <div className="project-hero-actions">
            {project.githubLink && (
              <a
                href={project.githubLink}
                target="_blank"
                rel="noreferrer"
                className="btn"
              >
                View Code
              </a>
            )}

            {project.liveDemo && (
              <a
                href={project.liveDemo}
                target="_blank"
                rel="noreferrer"
                className="btn secondary"
              >
                Live Demo
              </a>
            )}
          </div>
        )}
      </section>

      {/* ================= METRICS ================= */}
      {(metrics.accuracy || metrics.latency || metrics.users) && (
        <section className="metrics-grid">
          {metrics.accuracy && (
            <div className="metric-card">
              <span className="metric-value">{metrics.accuracy}</span>
              <span className="metric-label">Accuracy</span>
            </div>
          )}

          {metrics.latency && (
            <div className="metric-card">
              <span className="metric-value">{metrics.latency}</span>
              <span className="metric-label">Latency</span>
            </div>
          )}

          {metrics.users && (
            <div className="metric-card">
              <span className="metric-value">{metrics.users}</span>
              <span className="metric-label">Users</span>
            </div>
          )}
        </section>
      )}

      {/* ================= MAIN LAYOUT ================= */}
      <div className="project-layout">

        {/* ================= LEFT CONTENT ================= */}
        <div className="project-content">

          {project.shortDescription && (
            <section className="project-section">
              <h2>Overview</h2>
              <p>{project.shortDescription}</p>
            </section>
          )}

          {project.problemStatement && (
            <section className="project-section">
              <h2>Problem Statement</h2>
              <p>{project.problemStatement}</p>
            </section>
          )}

          {project.solution && (
            <section className="project-section">
              <h2>Solution</h2>
              <p>{project.solution}</p>
            </section>
          )}

          {/* ================= ARCHITECTURE ================= */}
          {(project.architecture || project.architectureImage) && (
            <section className="project-section">
              <h2>Architecture</h2>

              {project.architecture && <p>{project.architecture}</p>}

              {project.architectureImage && (
                <img
                  src={project.architectureImage}
                  alt="Architecture Diagram"
                  className="architecture-image"
                />
              )}
            </section>
          )}

          {/* ================= SCREENSHOTS ================= */}
          {Array.isArray(project.screenshots) && project.screenshots.length > 0 && (
            <section className="project-section">
              <h2>Screenshots</h2>

              <div className="screenshot-grid">
                {project.screenshots.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`Screenshot ${i + 1}`}
                  />
                ))}
              </div>
            </section>
          )}

          {project.impact && (
            <section className="project-section">
              <h2>Impact & Results</h2>
              <p>{project.impact}</p>
            </section>
          )}

        </div>

        {/* ================= RIGHT META ================= */}
        <aside className="project-meta">

          {project.category && (
            <div className="meta-card">
              <h4>Category</h4>
              <span className="meta-badge">{project.category}</span>
            </div>
          )}

          {Array.isArray(project.techStack) && project.techStack.length > 0 && (
            <div className="meta-card">
              <h4>Tech Stack</h4>
              <div className="meta-tech">
                {project.techStack.map((tech) => (
                  <span key={tech}>{tech}</span>
                ))}
              </div>
            </div>
          )}

        </aside>

      </div>
    </div>
  );
}
