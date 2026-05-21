


page pour modifier le mot de passe :
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "@src/app/context/AuthContext";
import { useToast } from "@src/app/context/ToastContext";

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
              //navigate("/dashboard");
              navigate("/inscription/domaine");
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

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useToast } from "@src/app/context/ToastContext";

const ChangePassword = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.newPassword !== form.confirmPassword) {
      showToast("Les mots de passe ne correspondent pas", "error");
      return;
    }

    if (form.newPassword.length < 6) {
      showToast(
        "Le nouveau mot de passe doit contenir au moins 6 caractères",
        "error"
      );
      return;
    }

    setLoading(true);

    try {
      // Exemple appel API
      // await authService.changePassword(form);

      showToast("Mot de passe modifié avec succès");

      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error) {
      console.error(error);
      showToast("Une erreur est survenue", "error");
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
          <h3 className="fw-bold">Modifier le mot de passe</h3>
          <small className="text-muted">
            Veuillez renseigner les informations ci-dessous
          </small>
        </div>

        {/* Ancien mot de passe */}
        <div className="input-group mb-3">
          <span className="input-group-text">
            <i className="bi bi-lock"></i>
          </span>

          <input
            type="password"
            placeholder="Ancien mot de passe"
            value={form.oldPassword}
            onChange={(e) =>
              setForm({
                ...form,
                oldPassword: e.target.value,
              })
            }
            className="form-control"
            required
          />
        </div>

        {/* Nouveau mot de passe */}
        <div className="input-group mb-3">
          <span className="input-group-text">
            <i className="bi bi-shield-lock"></i>
          </span>

          <input
            type="password"
            placeholder="Nouveau mot de passe"
            value={form.newPassword}
            onChange={(e) =>
              setForm({
                ...form,
                newPassword: e.target.value,
              })
            }
            className="form-control"
            required
          />
        </div>

        {/* Confirmation */}
        <div className="input-group mb-4">
          <span className="input-group-text">
            <i className="bi bi-check2-circle"></i>
          </span>

          <input
            type="password"
            placeholder="Confirmer le mot de passe"
            value={form.confirmPassword}
            onChange={(e) =>
              setForm({
                ...form,
                confirmPassword: e.target.value,
              })
            }
            className="form-control"
            required
          />
        </div>

        {/* Bouton */}
        <button
          className="btn btn-primary w-100"
          type="submit"
          disabled={
            !form.oldPassword ||
            !form.newPassword ||
            !form.confirmPassword ||
            loading
          }
        >
          {loading
            ? "Modification..."
            : "Modifier le mot de passe"}
        </button>

        {/* Retour */}
        <button
          type="button"
          className="btn btn-light border w-100 mt-2"
          onClick={() => navigate(-1)}
        >
          Retour
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;


