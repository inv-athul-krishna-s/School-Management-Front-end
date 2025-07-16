import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await login(username, password);
    } catch (err) {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="position-absolute top-50 start-50 translate-middle w-100" style={{ maxWidth: "400px" }}>
      <div className="card shadow border-0 p-4">
        <h3 className="text-center text-primary fw-bold mb-4">Login</h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-danger text-center small">{error}</p>}
          <div className="d-grid">
            <button type="submit" className="btn btn-primary fw-semibold">
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
