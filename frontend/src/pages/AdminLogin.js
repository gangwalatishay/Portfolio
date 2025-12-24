import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        "https://portfolio-backend-alaj.onrender.com/api/admin/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ email, password })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      // ✅ SAVE TOKEN
      localStorage.setItem("adminToken", data.token);

      // ✅ REDIRECT
      navigate("/admin");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container admin-login">
      <h1>Admin Login</h1>

      <form className="contact-form" onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button className="btn" type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
