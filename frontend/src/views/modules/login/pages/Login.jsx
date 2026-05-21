import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from "@coreui/react";

import { useAuth } from "@src/app/context/AuthContext";
import { useToast } from "@src/app/context/ToastContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [showPassword, setShowPassword] =
    useState(false);

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const success = await login(
        form.username,
        form.password
      );

      if (success) {
        showToast(
          "Vous êtes connecté(e) en tant que administrateur avec succès !"
        );

        setTimeout(() => {
          navigate("/inscription/dashboard");
        }, 1200);
      } else {
        showToast(
          "Votre nom d'utilisateur et votre mot de passe ne correspondent pas. Si vous avez oublié votre mot de passe, contactez l'administrateur.",
          "error"
        );
      }
    } catch (error) {
      console.error(error);
      showToast("Une erreur est survenue", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center"
      style={{
        background:
          "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)",
      }}
    >
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8} lg={6}>
            <CCard className="border-0 shadow rounded-4 overflow-hidden">
              <CRow className="g-0">
                {/* LEFT SIDE - FORM */}
                <CCol md={7}>
                  <CCardBody className="p-4">
                    {/* HEADER */}
                    <div className="mb-4">
                      <h3
                        className="fw-bold mb-1"
                        style={{ color: "#0f172a" }}
                      >
                        Connexion
                      </h3>

                      <p
                        className="text-medium-emphasis mb-0"
                        style={{ fontSize: "14px" }}
                      >
                        Accédez à votre espace
                        d'administration
                      </p>
                    </div>

                    <CForm onSubmit={handleSubmit}>
                      {/* USERNAME */}
                      <div className="mb-3">
                        <label
                          className="form-label fw-semibold mb-1"
                          style={{ fontSize: "14px" }}
                        >
                          Nom d'utilisateur
                        </label>

                        <CInputGroup>
                          <CInputGroupText>
                            <i className="bi bi-person-fill"></i>
                          </CInputGroupText>

                          <CFormInput
                            type="text"
                            placeholder="Votre username"
                            value={form.username}
                            onChange={(e) =>
                              setForm({
                                ...form,
                                username:
                                  e.target.value,
                              })
                            }
                            style={{
                              height: "42px",
                              fontSize: "14px",
                            }}
                            required
                          />
                        </CInputGroup>
                      </div>

                      {/* PASSWORD */}
                      <div className="mb-4">
                        <label
                          className="form-label fw-semibold mb-1"
                          style={{ fontSize: "14px" }}
                        >
                          Mot de passe
                        </label>

                        <CInputGroup>
                          <CInputGroupText>
                            <i className="bi bi-lock-fill"></i>
                          </CInputGroupText>

                          <CFormInput
                            type={
                              showPassword
                                ? "text"
                                : "password"
                            }
                            placeholder="Votre mot de passe"
                            value={form.password}
                            onChange={(e) =>
                              setForm({
                                ...form,
                                password:
                                  e.target.value,
                              })
                            }
                            style={{
                              height: "42px",
                              fontSize: "14px",
                            }}
                            required
                          />

                          <CInputGroupText
                            style={{
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              setShowPassword(
                                !showPassword
                              )
                            }
                          >
                            <i
                              className={`bi ${
                                showPassword
                                  ? "bi-eye-slash-fill"
                                  : "bi-eye-fill"
                              }`}
                            ></i>
                          </CInputGroupText>
                        </CInputGroup>
                      </div>

                      {/* BUTTON */}
                      <CButton
                        type="submit"
                        color="primary"
                        className="w-100 fw-semibold border-0"
                        disabled={
                          !form.username ||
                          !form.password ||
                          loading
                        }
                        style={{
                          height: "44px",
                          fontSize: "14px",
                          borderRadius: "10px",
                        }}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Connexion...
                          </>
                        ) : (
                          "Se connecter"
                        )}
                      </CButton>
                    </CForm>
                  </CCardBody>
                </CCol>

                {/* RIGHT SIDE - LOGO */}
                <CCol
                  md={5}
                  className="d-none d-md-flex flex-column justify-content-center align-items-center text-center text-white"
                  style={{
                    background:
                      "linear-gradient(135deg, #1e40af 0%, #2563eb 100%)",
                  }}
                >
                  <div
                    className="d-flex justify-content-center align-items-center rounded-circle mb-3"
                    style={{
                      width: 75,
                      height: 75,
                      background:
                        "rgba(255,255,255,0.15)",
                    }}
                  >
                    <i className="bi bi-mortarboard-fill fs-3"></i>
                  </div>

                  <h4 className="fw-bold mb-2">
                    Gestion Académique
                  </h4>

                  <p
                    className="text-white-50 px-3"
                    style={{
                      fontSize: "13px",
                      lineHeight: 1.6,
                      maxWidth: 260,
                    }}
                  >
                    Plateforme moderne de gestion des
                    inscriptions et parcours
                    académiques.
                  </p>
                </CCol>
              </CRow>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Login;