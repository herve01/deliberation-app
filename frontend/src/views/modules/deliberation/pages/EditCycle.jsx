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
  CFormTextarea,
} from "@coreui/react";

import cycleService from "@src/infrastructure/services/inscription/cycleService";

import { useToast } from "@src/app/context/ToastContext";

export default function EditCycle() {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  const cycleToEdit = location.state?.cycle;

  const [form, setForm] = useState({
    intitule: "",
    description: "",
    ordre: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // VALIDATION
  const isFormValid = (form) => {
    return (
      form.intitule.trim().length >= 2 &&
      form.intitule.trim().length <= 30 &&
      form.ordre !== "" &&
      !isNaN(form.ordre)
    );
  };

  const isValid = isFormValid(form);

  // LOAD INITIAL DATA
  useEffect(() => {
    if (cycleToEdit) {
      setForm({
        intitule: cycleToEdit.intitule || "",
        description: cycleToEdit.description || "",
        ordre: cycleToEdit.ordre || "",
      });
    }

    setLoading(false);
  }, [cycleToEdit]);

  // HANDLE CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "ordre" ? value.replace(/\D/g, "") : value,
    }));
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValid) return;

    try {
      const payload = {
        ...form,
        ordre: parseInt(form.ordre),
      };

      if (cycleToEdit) {
        await cycleService.update(cycleToEdit.id, payload);
      } else {
        await cycleService.add(payload);
      }

      showToast(
        cycleToEdit
          ? "Cycle modifié avec succès !"
          : "Cycle enregistré avec succès !",
        "success"
      );

      setTimeout(() => {
        navigate("/inscription/cycle");
      }, 1500);
    } catch (e) {
      console.error(e);

      setError("Erreur lors de l'opération");

      showToast(
        "Une erreur s'est produite",
        "error"
      );
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
    <CCard className="border-1 shadow-sm">
      <CCardHeader>
        <strong>
          {cycleToEdit
            ? "Modifier un cycle"
            : "Ajouter un cycle"}
        </strong>
      </CCardHeader>

      <CCardBody>
        {error && (
          <CAlert color="danger">
            {error}
          </CAlert>
        )}

        <CForm onSubmit={handleSubmit}>
          <CRow className="g-4">
            {/* INTITULE */}
            <CCol md={6}>
              <CFormLabel>
                Intitulé *
              </CFormLabel>

              <CFormInput
                name="intitule"
                placeholder="Ex : Premier Cycle"
                value={form.intitule}
                onChange={handleChange}
                maxLength={30}
                required
              />

              <small className="text-muted">
                Maximum 30 caractères
              </small>
            </CCol>

            {/* ORDRE */}
            <CCol md={6}>
              <CFormLabel>
                Ordre *
              </CFormLabel>

              <CFormInput
                type="number"
                min={1}
                name="ordre"
                placeholder="Ex : 1"
                value={form.ordre}
                onChange={handleChange}
                required
              />

              <small className="text-muted">
                Ordre d'affichage du cycle
              </small>
            </CCol>

            {/* DESCRIPTION */}
            <CCol md={12}>
              <CFormLabel>
                Description
              </CFormLabel>

              <CFormTextarea
                name="description"
                rows={4}
                placeholder="Description du cycle universitaire..."
                value={form.description}
                onChange={handleChange}
              />
            </CCol>
          </CRow>

          {/* BUTTONS */}
          <div className="d-flex justify-content-center gap-3 mt-4">
            <CButton
              type="submit"
              color="primary"
              style={{ width: 200 }}
              className="d-flex align-items-center justify-content-center"
              disabled={!isValid}
            >
              <i
                className={`bi me-2 ${
                  cycleToEdit
                    ? "bi-pencil-square"
                    : "bi-check-circle"
                }`}
              />

              {cycleToEdit
                ? "Modifier"
                : "Enregistrer"}
            </CButton>

            <CButton
              type="button"
              color="secondary"
              style={{ width: 200 }}
              onClick={() => navigate(-1)}
              className="d-flex align-items-center justify-content-center"
            >
              <i className="bi bi-arrow-left me-2" />
              Annuler
            </CButton>
          </div>
        </CForm>
      </CCardBody>
    </CCard>
  );
}