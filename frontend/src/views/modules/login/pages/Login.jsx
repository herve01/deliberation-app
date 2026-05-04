import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "@src/core/context/AuthContext";
import { useToast } from "@src/core/context/ToastContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const success = await login(form.username, form.password);

      if (success) {
          showToast("Vous êtes connectés en tant qu'administrateur");
          setTimeout(() => {
              navigate("/dashboard");
          }, 3000);
      } else {
          showToast("identifiants saisient sont incorrectes", "error");
      }
    } catch (error) {
      console.error(error);
      alert("Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">

      <form
        onSubmit={handleSubmit}
        className="p-5 shadow rounded bg-white"
        style={{ width: 500 }}
      >
        {/* Header */}
        <div className="text-start mb-4">
          <h3 className="fw-bold">Connexion</h3>
          <small className="text-muted">
            Connectez-vous à votre compte
          </small>
        </div>

        {/* Username */}
        <div className="input-group mb-3">
          <span className="input-group-text">
            <i className="bi bi-person"></i>
          </span>
          <input
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={(e) =>
              setForm({ ...form, username: e.target.value })
            }
            className="form-control"
            required
          />
        </div>

        {/* Password */}
        <div className="input-group mb-4">
          <span className="input-group-text">
            <i className="bi bi-lock"></i>
          </span>
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            className="form-control"
            required
          />
        </div>

        {/* Button */}
        <button
          className="btn btn-primary w-100"
          type="submit"
          disabled={!form.username || !form.password || loading}
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </div>
  );
};

export default Login;