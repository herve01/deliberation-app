import React, { useEffect, useState } from "react";

import {
  useNavigate,
  useLocation,
} from "react-router-dom";

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
  CFormFeedback,
  CFormSelect,
} from "@coreui/react";

import {
  cilBook,
  cilClock,
  cilEducation,
  cilSave,
  cilArrowLeft,
  cilLibrary,
} from "@coreui/icons";

import CIcon from "@coreui/icons-react";

import ecueService from "@src/infrastructure/services/cotation/ecueService";
import uniteEnseignementService from "@src/infrastructure/services/cotation/uniteEnseignementService";

import { useToast } from "@src/app/context/ToastContext";

export default function EditEcue() {

  const navigate = useNavigate();
  const location = useLocation();

  const { showToast } = useToast();

  const ecueToEdit = location.state?.ecue;

  const [ues, setUes] = useState([]);

  const [form, setForm] = useState({
    ueId: "",
    intitule: "",
    credit: "",
    nombreHeureCmi: "",
    nombreHeureTd: "",
    nombreHeureTp: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // VALIDATION
  const isFormValid = () => {

    return (
      form.ueId.trim().length > 0 &&
      form.intitule.trim().length >= 2
    );
  };

  const isValid = isFormValid();

  // TOTAL HEURES
  const totalHeures =
    (Number(form.nombreHeureCmi) || 0) +
    (Number(form.nombreHeureTd) || 0) +
    (Number(form.nombreHeureTp) || 0);

  // LOAD INITIAL DATA
  useEffect(() => {

    async function loadData() {

      try {

        setLoading(true);

        // LOAD UES
        const ueData =
          await uniteEnseignementService.getAll();

        setUes(ueData || []);

        // LOAD ECUE
        if (ecueToEdit) {

          setForm({
            ueId: ecueToEdit.ueId || "",
            intitule: ecueToEdit.intitule || "",
            credit: ecueToEdit.credit || "",

            nombreHeureCmi:
              ecueToEdit.nombreHeureCmi || "",

            nombreHeureTd:
              ecueToEdit.nombreHeureTd || "",

            nombreHeureTp:
              ecueToEdit.nombreHeureTp || "",
          });
        }

      } catch (e) {

        console.error(e);

        setError(
          "Erreur lors du chargement"
        );

      } finally {

        setLoading(false);
      }
    }

    loadData();

  }, [ecueToEdit]);

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

    if (!isValid) return;

    try {

      setSaving(true);
      setError("");

      const data = {

        ueId: form.ueId,

        intitule: form.intitule,

        credit:
          Number(form.credit) || 0,

        nombreHeureCmi:
          Number(form.nombreHeureCmi) || 0,

        nombreHeureTd:
          Number(form.nombreHeureTd) || 0,

        nombreHeureTp:
          Number(form.nombreHeureTp) || 0,
      };

      if (ecueToEdit) {

        await ecueService.update(
          ecueToEdit.id,
          data
        );

      } else {

        await ecueService.add(data);
      }

      showToast(
        ecueToEdit
          ? "ECUE modifié avec succès !"
          : "ECUE enregistré avec succès !"
      );

      setTimeout(() => {

        navigate("/cotation/ecue");

      }, 1000);

    } catch (e) {

      console.error(e);

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

    <div className="container-fluid px-3">

      <CCard className="border-1 shadow-sm">

        {/* HEADER */}
        <CCardHeader
          className="
            bg-light
            d-flex
            justify-content-between
            align-items-center
            py-3
          "
        >

          <div>

            <h5 className="mb-0 fw-bold">

              {ecueToEdit
                ? "Modifier un ECUE"
                : "Ajouter un ECUE"}

            </h5>

            <small className="text-medium-emphasis">

              Gestion des éléments constitutifs d’UE

            </small>
          </div>

          <CButton
            color="secondary"
            variant="outline"
            onClick={() => navigate(-1)}
          >
            <CIcon
              icon={cilArrowLeft}
              className="me-2"
            />

            Retour
          </CButton>

        </CCardHeader>

        {/* BODY */}
        <CCardBody>

          {error && (

            <CAlert color="danger">
              {error}
            </CAlert>
          )}

          <CForm onSubmit={handleSubmit}>

            {/* INFORMATIONS GENERALES */}
            <div className="mb-4">

              <h6 className="fw-bold mb-3">
                Informations générales
              </h6>

              <CRow className="g-3">

                {/* UNITE D'ENSEIGNEMENT */}
                <CCol md={4}>

                  <CFormLabel>
                    Unité d’enseignement *
                  </CFormLabel>

                  <CInputGroup>

                    <CInputGroupText>
                      <CIcon icon={cilLibrary} />
                    </CInputGroupText>

                    <CFormSelect
                      name="ueId"
                      value={form.ueId}
                      onChange={handleChange}
                      invalid={!form.ueId}
                    >

                      <option value="">
                        -- Sélectionner une UE --
                      </option>

                      {ues.map((ue) => (

                        <option
                          key={ue.id}
                          value={ue.id}
                        >
                          {ue.intitule}
                        </option>

                      ))}

                    </CFormSelect>

                    <CFormFeedback invalid>
                      Veuillez sélectionner une UE
                    </CFormFeedback>

                  </CInputGroup>

                </CCol>

                {/* INTITULE */}
                <CCol md={8}>

                  <CFormLabel>
                    Intitulé *
                  </CFormLabel>

                  <CInputGroup>

                    <CInputGroupText>
                      <CIcon icon={cilBook} />
                    </CInputGroupText>

                    <CFormInput
                      name="intitule"
                      placeholder="Ex: Algorithmique"
                      value={form.intitule}
                      onChange={handleChange}
                      invalid={
                        form.intitule &&
                        form.intitule.length < 2
                      }
                    />

                    <CFormFeedback invalid>
                      L’intitulé est obligatoire
                    </CFormFeedback>

                  </CInputGroup>

                </CCol>

              </CRow>

            </div>

            {/* CREDITS & HEURES */}
            <div className="mb-4">

              <h6 className="fw-bold mb-3">
                Crédits et volumes horaires
              </h6>

              <CRow className="g-3">

                {/* CREDIT */}
                <CCol md={3}>

                  <CFormLabel>
                    Crédit
                  </CFormLabel>

                  <CInputGroup>

                    <CInputGroupText>
                      <CIcon icon={cilEducation} />
                    </CInputGroupText>

                    <CFormInput
                      type="number"
                      step="0.5"
                      min={0}
                      name="credit"
                      placeholder="0"
                      value={form.credit}
                      onChange={handleChange}
                    />

                  </CInputGroup>

                </CCol>

                {/* CMI */}
                <CCol md={3}>

                  <CFormLabel>
                    Heure CMI
                  </CFormLabel>

                  <CInputGroup>

                    <CInputGroupText>
                      <CIcon icon={cilClock} />
                    </CInputGroupText>

                    <CFormInput
                      type="number"
                      min={0}
                      name="nombreHeureCmi"
                      placeholder="0"
                      value={form.nombreHeureCmi}
                      onChange={handleChange}
                    />

                  </CInputGroup>

                </CCol>

                {/* TD */}
                <CCol md={3}>

                  <CFormLabel>
                    Heure TD
                  </CFormLabel>

                  <CInputGroup>

                    <CInputGroupText>
                      <CIcon icon={cilClock} />
                    </CInputGroupText>

                    <CFormInput
                      type="number"
                      min={0}
                      name="nombreHeureTd"
                      placeholder="0"
                      value={form.nombreHeureTd}
                      onChange={handleChange}
                    />

                  </CInputGroup>

                </CCol>

                {/* TP */}
                <CCol md={3}>

                  <CFormLabel>
                    Heure TP
                  </CFormLabel>

                  <CInputGroup>

                    <CInputGroupText>
                      <CIcon icon={cilClock} />
                    </CInputGroupText>

                    <CFormInput
                      type="number"
                      min={0}
                      name="nombreHeureTp"
                      placeholder="0"
                      value={form.nombreHeureTp}
                      onChange={handleChange}
                    />

                  </CInputGroup>

                </CCol>

              </CRow>

            </div>

            {/* TOTAL */}
            <div
              className="
                bg-light
                border
                rounded
                p-3
                mb-4
              "
            >

              <div
                className="
                  d-flex
                  justify-content-between
                  align-items-center
                "
              >

                <span className="fw-semibold">
                  Volume horaire total
                </span>

                <span
                  className="
                    fw-bold
                    text-primary
                    fs-5
                  "
                >
                  {totalHeures} h
                </span>

              </div>

            </div>

            {/* BUTTONS */}
            <div
              className="
                d-flex
                justify-content-center
                gap-3
                mt-4
              "
            >

              <CButton
                type="submit"
                color="primary"
                style={{ width: 220 }}
                disabled={!isValid || saving}
                className="
                  d-flex
                  align-items-center
                  justify-content-center
                "
              >

                {saving ? (

                  <CSpinner
                    size="sm"
                    className="me-2"
                  />

                ) : (

                  <CIcon
                    icon={cilSave}
                    className="me-2"
                  />
                )}

                {ecueToEdit
                  ? "Modifier"
                  : "Enregistrer"}

              </CButton>

              <CButton
                type="button"
                color="secondary"
                variant="outline"
                style={{ width: 220 }}
                onClick={() => navigate(-1)}
              >
                Annuler
              </CButton>

            </div>

          </CForm>

        </CCardBody>

      </CCard>

    </div>
  );
}