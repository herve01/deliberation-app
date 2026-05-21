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
  CFormSelect,
  CInputGroup,
  CInputGroupText,
} from "@coreui/react";

import {
  cilLayers,
  cilSortAscending,
  cilSave,
  cilPencil,
  cilArrowLeft,
} from "@coreui/icons";

import CIcon from "@coreui/icons-react";

import semestreService from "@src/infrastructure/services/cotation/semestreService";

import { useToast } from "@src/app/context/ToastContext";

export default function EditSemestre() {
  const navigate = useNavigate();
  const location = useLocation();

  const { showToast } = useToast();

  const semestreToEdit = location.state?.semestre;

  const [form, setForm] = useState({
    numero: 1,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  // VALIDATION
  const isFormValid = () => {
    return (
      Number(form.number) > 0
    );
  };

  const isValid = isFormValid();

  // LOAD DATA
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        if (semestreToEdit) {
          setForm({
            number: semestreToEdit.number || 1,
          });
        }
      } catch (error) {
        console.error(error);

        setError("Erreur lors du chargement des données");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [semestreToEdit]);

  // HANDLE CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValid || saving) return;

    try {
      setSaving(true);

      if (semestreToEdit) {
        await semestreService.update(
          semestreToEdit.id,
          form
        );

        showToast(
          "Semestre modifié avec succès !",
          "success"
        );
      } else {
        await semestreService.add(form);

        showToast(
          "Semestre enregistré avec succès !",
          "success"
        );
      }

      setTimeout(() => {
        navigate("/inscription/semestre");
      }, 1000);

    } catch (error) {
      console.error(error);

      setError(
        "Une erreur s'est produite lors de l'enregistrement"
      );

      showToast(
        "Erreur lors de l'opération",
        "error"
      );

    } finally {
      setSaving(false);
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

      <CCardHeader className="bg-light border-bottom">

        <h5 className="mb-0 fw-semibold">
          {semestreToEdit
            ? "Modifier le semestre"
            : "Ajouter un semestre"}
        </h5>

      </CCardHeader>

      <CCardBody className="p-4">

        {error && (
          <CAlert color="danger">
            {error}
          </CAlert>
        )}

        <CForm onSubmit={handleSubmit}>

          <CRow className="mb-4">


            {/* numero */}
            <CCol md={12}>

              <CFormLabel>
                numero
                <span className="text-danger">
                  *
                </span>
              </CFormLabel>

              <CInputGroup>

                <CInputGroupText>
                  <CIcon
                    icon={cilSortAscending}
                  />
                </CInputGroupText>

                <CFormInput
                  type="number"
                  min={1}
                  name="numero"
                  placeholder="Ex: 1"
                  value={form.numero}
                  onChange={handleChange}
                />

              </CInputGroup>

            </CCol>

          </CRow>

          {/* ACTIONS */}
          <div className="d-flex flex-column flex-md-row justify-content-center gap-3 mt-4">

            <CButton
              type="submit"
              color="primary"
              disabled={!isValid || saving}
              className="px-4 py-2 d-flex align-items-center justify-content-center"
            >

              {saving ? (
                <>
                  <CSpinner
                    size="sm"
                    className="me-2"
                  />
                  Enregistrement...
                </>
              ) : (
                <>
                  <CIcon
                    icon={
                      semestreToEdit
                        ? cilPencil
                        : cilSave
                    }
                    className="me-2"
                  />

                  {semestreToEdit
                    ? "Modifier"
                    : "Enregistrer"}
                </>
              )}

            </CButton>

            <CButton
              type="button"
              color="light"
              className="px-4 py-2 border d-flex align-items-center justify-content-center"
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