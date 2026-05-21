import React, { useEffect, useState } from 'react'

import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CRow,
  CAlert,
  CSpinner,
  CInputGroup,
  CInputGroupText,
} from '@coreui/react'

import CIcon from "@coreui/icons-react";

import {
  cilUser,
  cilEnvelopeClosed,
  cilLockLocked,
  cilPeople,
  cilArrowLeft,
  cilCheckCircle,
} from "@coreui/icons";

import { useNavigate, useLocation } from "react-router-dom";

import {
  isValidEmail,
  isValidName,
} from "@src/shared/validators";

import userService from "@src/infrastructure/services/setting/userService";

import { useToast } from "@src/app/context/ToastContext";

export default function EditUser() {

  const navigate = useNavigate();

  const location = useLocation();

  const { showToast } = useToast();

  const userToEdit = location.state?.user;

  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    username: '',
    email: '',
    passwd: '',
    role: 'INSCRIPTION',
  });

  const [loading, setLoading] = useState(true);

  const [submitLoading, setSubmitLoading] =
    useState(false);

  const [error, setError] = useState('');

  // VALIDATION
  const isValid = (

    isValidName(form.nom) &&
    isValidName(form.prenom) &&

    form.username.trim().length >= 3 &&

    (
      !form.email ||
      isValidEmail(form.email)
    ) &&

    (
      userToEdit
        ? true
        : form.passwd.trim().length >= 4
    ) &&

    form.role
  );

  // LOAD INITIAL
  useEffect(() => {

    if (userToEdit) {

      setForm({
        nom: userToEdit.nom || '',
        prenom: userToEdit.prenom || '',
        username: userToEdit.username || '',
        email: userToEdit.email || '',
        passwd: '',
        role: userToEdit.role || 'INSCRIPTION',
      });

    }

    setLoading(false);

  }, [userToEdit]);

  // HANDLE CHANGE
  const handleChange = (e) => {

    const { name, value } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // SUBMIT
  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!isValid) return;

    try {

      setSubmitLoading(true);

      setError("");

      const payload = {
        ...form
      };

      // SI PASSWORD VIDE EN MODIFICATION
      if (
        userToEdit &&
        !payload.passwd
      ) {
        delete payload.passwd;
      }

      if (userToEdit) {

        await userService.update(
          userToEdit.id,
          payload
        );

      } else {

        await userService.add(payload);

      }

      showToast(
        userToEdit
          ? "Utilisateur modifié avec succès !"
          : "Utilisateur enregistré avec succès !"
      );

      setTimeout(() => {
        navigate("/utilisateur");
      }, 1500);

    } catch (e) {

      console.error(e);

      setError(
        "Erreur lors de l'opération"
      );

      showToast(
        "Une erreur s'est produite",
        "error"
      );

    } finally {

      setSubmitLoading(false);

    }
  };

  // LOADING
  if (loading) {

    return (
      <div className="text-center mt-5">
        <CSpinner color="primary" />
      </div>
    );
  }

  return (

    <CCard className="border-1 shadow-sm">

      {/* HEADER */}
      <CCardHeader>
        <strong>
          {userToEdit
            ? "Modifier un utilisateur"
            : "Ajouter un utilisateur"}
        </strong>
      </CCardHeader>

      {/* BODY */}
      <CCardBody>

        {error && (
          <CAlert color="danger">
            {error}
          </CAlert>
        )}

        <CForm onSubmit={handleSubmit}>

          <CRow>

            {/* NOM */}
            <CCol md={6} className="mb-3">

              <CFormLabel>
                Nom *
              </CFormLabel>

              <CInputGroup>

                <CInputGroupText>
                  <CIcon icon={cilUser} />
                </CInputGroupText>

                <CFormInput
                  name="nom"
                  value={form.nom}
                  onChange={handleChange}
                  invalid={
                    !isValidName(form.nom)
                    && form.nom
                  }
                  placeholder="Nom"
                />

              </CInputGroup>

            </CCol>

            {/* PRENOM */}
            <CCol md={6} className="mb-3">

              <CFormLabel>
                Prénom *
              </CFormLabel>

              <CInputGroup>

                <CInputGroupText>
                  <CIcon icon={cilUser} />
                </CInputGroupText>

                <CFormInput
                  name="prenom"
                  value={form.prenom}
                  onChange={handleChange}
                  invalid={
                    !isValidName(form.prenom)
                    && form.prenom
                  }
                  placeholder="Prénom"
                />

              </CInputGroup>

            </CCol>

            {/* USERNAME */}
            <CCol md={6} className="mb-3">

              <CFormLabel>
                Username *
              </CFormLabel>

              <CInputGroup>

                <CInputGroupText>
                  @
                </CInputGroupText>

                <CFormInput
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="Nom d'utilisateur"
                />

              </CInputGroup>

            </CCol>

            {/* EMAIL */}
            <CCol md={6} className="mb-3">

              <CFormLabel>
                Email
              </CFormLabel>

              <CInputGroup>

                <CInputGroupText>
                  <CIcon
                    icon={cilEnvelopeClosed}
                  />
                </CInputGroupText>

                <CFormInput
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  invalid={
                    !isValidEmail(form.email)
                    && form.email
                  }
                  placeholder="email@gmail.com"
                />

              </CInputGroup>

            </CCol>

            {/* PASSWORD */}
            <CCol md={6} className="mb-3">

              <CFormLabel>
                Mot de passe
                {!userToEdit && " *"}
              </CFormLabel>

              <CInputGroup>

                <CInputGroupText>
                  <CIcon
                    icon={cilLockLocked}
                  />
                </CInputGroupText>

                <CFormInput
                  name="passwd"
                  type="password"
                  value={form.passwd}
                  onChange={handleChange}
                  placeholder={
                    userToEdit
                      ? "Laisser vide pour ne pas modifier"
                      : "Saisir le mot de passe"
                  }
                />

              </CInputGroup>

            </CCol>

            {/* ROLE */}
            <CCol md={6} className="mb-4">

              <CFormLabel>
                Rôle *
              </CFormLabel>

              <CInputGroup>

                <CInputGroupText>
                  <CIcon
                    icon={cilPeople}
                  />
                </CInputGroupText>

                <CFormSelect
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                >

                  <option value="ADMINISTRATEUR">
                    ADMINISTRATEUR
                  </option>

                  <option value="INSCRIPTION">
                    INSCRIPTION
                  </option>

                  <option value="COTATTION">
                    COTATTION
                  </option>

                  <option value="DELIBERATION">
                    DELIBERATION
                  </option>

                </CFormSelect>

              </CInputGroup>

            </CCol>

          </CRow>

          {/* BUTTONS */}
          <div className="d-flex justify-content-center gap-3">

            <CButton
              type="submit"
              color="primary"
              style={{ width: 220 }}
              className="d-flex align-items-center justify-content-center"
              disabled={
                !isValid ||
                submitLoading
              }
            >

              <CIcon
                icon={cilCheckCircle}
                className="me-2"
              />

              {submitLoading
                ? "Enregistrement..."
                : userToEdit
                  ? "Modifier"
                  : "Enregistrer"}

            </CButton>

            <CButton
              type="button"
              color="secondary"
              style={{ width: 220 }}
              className="d-flex align-items-center justify-content-center"
              onClick={() => navigate(-1)}
            >

              <CIcon
                icon={cilArrowLeft}
                className="me-2"
              />

              Annuler

            </CButton>

          </div>

        </CForm>

      </CCardBody>

    </CCard>
  );
}