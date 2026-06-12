import React, { useEffect, useState } from "react";

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
  cilCalendar,
  cilLayers,
  cilSave,
  cilPencil,
  cilArrowLeft,
} from "@coreui/icons";

import CIcon from "@coreui/icons-react";

import { useNavigate, useLocation } from "react-router-dom";

import semestreService from "@src/infrastructure/services/cotation/semestreService";
import sessionService from "@src/infrastructure/services/cotation/sessionService";

import { useToast } from "@src/app/context/ToastContext";

export default function EditSession() {

  const navigate = useNavigate();

  const location = useLocation();

  const { showToast } = useToast();

  const sessionToEdit =
    location.state?.session;

  const [form, setForm] = useState({
    semestreId: "",
    numero: 1,
  });

  const [semestres, setSemestres] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  // VALIDATION
  const isFormValid = () => {

    return (
      form.semestreId &&
      Number(form.numero) > 0
    );
  };

  const isValid = isFormValid();

  // LOAD DATA
  useEffect(() => {

    async function loadData() {

      try {

        setLoading(true);

        const semestresData =
          await semestreService.getAll();

        setSemestres(semestresData || []);

        if (sessionToEdit) {

          setForm({
            semestreId:
              sessionToEdit.semestre?.id ||
              "",
            numero:
              sessionToEdit.numero || 1,
          });
        }

      } catch (error) {

        console.error(error);

        setError(
          "Erreur lors du chargement des données"
        );

      } finally {

        setLoading(false);
      }
    }

    loadData();

  }, [sessionToEdit]);

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

      if (sessionToEdit) {

        await sessionService.update(
          sessionToEdit.id,
          form
        );

        showToast(
          "Session modifiée avec succès !",
          "success"
        );

      } else {

        await sessionService.add(form);

        showToast(
          "Session enregistrée avec succès !",
          "success"
        );
      }

      setTimeout(() => {

        navigate("/cotation/session");

      }, 1000);

    } catch (error) {

      console.error(error);

      setError(
        "Erreur lors de l'enregistrement"
      );

      showToast(
        "Une erreur s'est produite",
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

    <CCard className="border-0 shadow-sm rounded-4">

      <CCardHeader className="bg-light border-bottom">

        <h5 className="mb-0 fw-semibold">

          {sessionToEdit
            ? "Modifier une session"
            : "Ajouter une session"}

        </h5>

      </CCardHeader>

      <CCardBody className="p-4">

        {error && (

          <CAlert color="danger">
            {error}
          </CAlert>
        )}

        <CForm onSubmit={handleSubmit}>

          {/* SEMESTRE */}
          <CRow className="mb-4">

            <CCol md={12}>

              <CFormLabel>
                Semestre
                <span className="text-danger">
                  *
                </span>
              </CFormLabel>

              <CInputGroup>

                <CInputGroupText>

                  <CIcon icon={cilLayers} />

                </CInputGroupText>

                <CFormSelect
                  name="semestreId"
                  value={form.semestreId}
                  onChange={handleChange}
                >

                  <option value="">
                    -- choisir un semestre --
                  </option>

                  {semestres.map((s) => (

                    <option
                      key={s.id}
                      value={s.id}
                    >
                      {s.semestreName}
                    </option>
                  ))}

                </CFormSelect>

              </CInputGroup>

            </CCol>

          </CRow>

          {/* NUMERO */}
          <CRow className="mb-4">

            <CCol md={12}>

              <CFormLabel>
                Numéro de session
                <span className="text-danger">
                  *
                </span>
              </CFormLabel>

              <CInputGroup>

                <CInputGroupText>

                  <CIcon icon={cilCalendar} />

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
          <div
            className="
              d-flex
              flex-column
              flex-md-row
              justify-content-center
              gap-3
              mt-4
            "
          >

            <CButton
              type="submit"
              color="primary"
              disabled={!isValid || saving}
              className="px-4 py-2 d-flex
                align-items-center justify-content-center">
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
                      sessionToEdit ? cilPencil : cilSave}
                    className="me-2"
                  />
                  {sessionToEdit ? "Modifier" : "Enregistrer"}
                </>
              )}
            </CButton>

            <CButton
              type="button"
              color="light"
              className="border px-4 py-2 d-flex
                align-items-center justify-content-center"
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