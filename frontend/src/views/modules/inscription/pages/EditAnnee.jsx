import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CRow,
  CAlert,
  CSpinner,
  CInputGroup,
  CInputGroupText,
} from "@coreui/react";

import CIcon from "@coreui/icons-react";

import {
  cilCalendar,
  cilClock,
  cilEducation,
  cilSave,
  cilXCircle,
} from "@coreui/icons";

import anneeService from "@src/infrastructure/services/inscription/anneeService";
import { useToast } from "@src/app/context/ToastContext";

export default function EditAnnee() {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  const anneeToEdit = location.state?.annee;

  const [form, setForm] = useState({
    annee: "",
    dateOuverture: "",
    dateCloture: "",
    dateLimiteInscription: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isValid =
    form.annee.trim().length >= 4 &&
    form.dateOuverture &&
    form.dateCloture &&
    new Date(form.dateCloture) >= new Date(form.dateOuverture);

  useEffect(() => {
    if (anneeToEdit) {
      setForm({
        annee: anneeToEdit.annee || "",
        dateOuverture: anneeToEdit.dateOuverture?.slice(0, 10) || "",
        dateCloture: anneeToEdit.dateCloture?.slice(0, 10) || "",
        dateLimiteInscription:
          anneeToEdit.dateLimiteInscription?.slice(0, 10) || "",
      });
    }
    setLoading(false);
  }, [anneeToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValid) return;

    try {
      if (anneeToEdit) {
        await anneeService.update(anneeToEdit.id, form);
      } else {
        await anneeService.add(form);
      }

      showToast(
        anneeToEdit
          ? "Année modifiée avec succès !"
          : "Année ajoutée avec succès !"
      );

      setTimeout(() => navigate("/inscription/annee-academique"), 1200);
    } catch (e) {
      console.error(e);
      setError("Erreur lors de l'opération");
      showToast("Erreur lors de l'opération", "error");
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <CSpinner color="primary" />
      </div>
    );
  }

  return (
    <CCard className="shadow-sm border-1">
      <CCardHeader className="bg-light d-flex justify-content-between align-items-center py-3">
        <div>
          <h5 className="mb-0 fw-bold">
            {anneeToEdit
              ? "Modifier une année académique"
              : "Ajouter une année académique"}
          </h5>
          <small className="text-medium-emphasis">
            Gestion des années académiques
          </small>
        </div>
      </CCardHeader>

      <CCardBody>
        {error && <CAlert color="danger">{error}</CAlert>}

        <CForm onSubmit={handleSubmit}>
          <h6 className="mb-3">Informations générales</h6>

          <CRow className="mb-3">
            <CCol md={6}>
              <CFormLabel>Année *</CFormLabel>
              <CInputGroup>
                <CInputGroupText>
                  <CIcon icon={cilEducation} />
                </CInputGroupText>
                <CFormInput
                  name="annee"
                  placeholder="Ex: 2024-2025"
                  value={form.annee}
                  onChange={handleChange}
                />
              </CInputGroup>
            </CCol>

            <CCol md={6}>
              <CFormLabel>Date limite inscription *</CFormLabel>
              <CInputGroup>
                <CInputGroupText>
                  <CIcon icon={cilClock} />
                </CInputGroupText>
                <CFormInput
                  type="date"
                  name="dateLimiteInscription"
                  value={form.dateLimiteInscription}
                  onChange={handleChange}
                />
              </CInputGroup>
            </CCol>
          </CRow>

          <h6 className="mb-3 mt-4">Période académique</h6>

          <CRow className="mb-4">
            <CCol md={6}>
              <CFormLabel>Date ouverture *</CFormLabel>
              <CInputGroup>
                <CInputGroupText>
                  <CIcon icon={cilCalendar} />
                </CInputGroupText>
                <CFormInput
                  type="date"
                  name="dateOuverture"
                  value={form.dateOuverture}
                  onChange={handleChange}
                />
              </CInputGroup>
            </CCol>

            <CCol md={6}>
              <CFormLabel>Date clôture *</CFormLabel>
              <CInputGroup>
                <CInputGroupText>
                  <CIcon icon={cilCalendar} />
                </CInputGroupText>
                <CFormInput
                  type="date"
                  name="dateCloture"
                  value={form.dateCloture}
                  onChange={handleChange}
                />
              </CInputGroup>
            </CCol>
          </CRow>

          <div className="d-flex justify-content-center gap-3">

            <CButton
              type="submit"
              color="primary"
              style={{ width: 220 }}
              disabled={!isValid}
            >
              <CIcon icon={cilSave} className="me-2" />
              {anneeToEdit ? "Modifier" : "Enregistrer"}
            </CButton>

            <CButton
              type="button"
              color="secondary"
              style={{ width: 220 }}
              onClick={() => navigate(-1)}
            >
              <CIcon icon={cilXCircle} className="me-2" />
              Annuler
            </CButton>

          </div>
        </CForm>
      </CCardBody>
    </CCard>
  );
}