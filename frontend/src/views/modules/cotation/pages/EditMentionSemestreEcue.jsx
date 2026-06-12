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
  CFormSelect,
  CFormCheck,
} from "@coreui/react";

import {
  cilSave,
  cilArrowLeft,
  cilLibrary,
  cilEducation,
  cilList,
} from "@coreui/icons";

import CIcon from "@coreui/icons-react";

import mentionService from "@src/infrastructure/services/inscription/mentionService";
import anneeService from "@src/infrastructure/services/inscription/anneeService";
import semestreService from "@src/infrastructure/services/cotation/semestreService";
import ecueService from "@src/infrastructure/services/cotation/ecueService";

import mentionSemestreEcueDetailService from "@src/infrastructure/services/cotation/mentionSemestreEcueDetailService";

import { useToast } from "@src/app/context/ToastContext";

export default function EditMentionEcueDetail() {

  const navigate = useNavigate();
  const location = useLocation();

  const { showToast } = useToast();

  const dataToEdit = location.state?.mentionEcueDetail;

  const [mentions, setMentions] = useState([]);
  const [annees, setAnnees] = useState([]);
  const [semestres, setSemestres] = useState([]);
  const [ecues, setEcues] = useState([]);

  const [selectedEcues, setSelectedEcues] = useState([]);

  const [form, setForm] = useState({
    mentionId: "",
    semestreId: "",
    anneeId: "",
    details:[]
  });

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  // VALIDATION
  const isFormValid = () => {

    return (
      form?.mentionId &&
      form?.semestreId &&
      form?.anneeId &&
      form?.details.length > 0
    );
  };

  const isValid = isFormValid();

  // LOAD DATA
  useEffect(() => {

    async function loadData() {

      try {

        setLoading(true);

        const [mentionData, semestreData, anneeData,
        ] = await Promise.all([
          mentionService.getAll(),
          semestreService.getAll(),
          anneeService.getAll(),
        ]);

        setMentions(mentionData || []);
        setSemestres(semestreData || []);
        setAnnees(anneeData || []);

        // MODE EDIT
        if (dataToEdit) {

          setForm({
            mentionId: dataToEdit.mentionId || "",

            semestreId: dataToEdit?.semestreId || "",

            anneeId: dataToEdit?.anneeId || "",
          });

          /*setSelectedEcues([
            dataToEdit.ecueId,
          ]);*/
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

  }, [dataToEdit]);

  // HANDLE CHANGE
  const handleChange = (e) => {

    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // HANDLE ECUE CHECKBOX
  const handleEcueChange = (ecueId) => {

    setSelectedEcues((prev) => {
      if (prev.includes(ecueId)) {
        return prev.filter(
          (id) => id !== ecueId
        );
      }
      return [...prev, ecueId];
    });
  };

  // SUBMIT
  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!isValid) return;
    try {
      setSaving(true);
      setError("");

      // MODE EDIT
      if (dataToEdit) {

        await mentionSemestreEcueDetailService.update(
          dataToEdit.id,
          {
            ...form,

            ecueId:
              selectedEcues[0],

            noteAnnee:
              Number(form.noteAnnee) || 0,

            credit:
              Number(form.credit) || 0,
          }
        );

      } else {

        // INSERT MULTIPLE ECUE
        await Promise.all(

          selectedEcues.map((ecueId) =>

            mentionSemestreEcueDetailService.add({
              mentionSemestreEcueId:
                form.mentionSemestreEcueId,

              semestreId:
                form.semestreId,

              ecueId,

              noteAnnee:
                Number(form.noteAnnee) || 0,

              credit:
                Number(form.credit) || 0,
            })
          )
        );
      }

      showToast(
        dataToEdit
          ? "Modification réussie !"
          : "Enregistrement réussi !"
      );

      setTimeout(() => {

        navigate(
          "/cotation/mention-ecue-details"
        );

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

      <CCard className="shadow-sm border-1">

        {/* HEADER */}
        <CCardHeader
          className="
            bg-light
            d-flex
            justify-content-between
            align-items-center
          "
        >

          <div>

            <h5 className="mb-0 fw-bold">

              {dataToEdit
                ? "Modifier"
                : "Ajouter"}

            </h5>

            <small className="text-medium-emphasis">

              Attribution des ECUE à une mention

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

            <CRow className="g-3 mb-4">

              {/* MENTION */}
              <CCol md={6}>

                <CFormLabel>
                  Mention *
                </CFormLabel>

                <CInputGroup>

                  <CInputGroupText>
                    <CIcon icon={cilLibrary} />
                  </CInputGroupText>

                  <CFormSelect
                    name="mentionId"
                    value={form.mentionId}
                    onChange={handleChange}
                  >

                    <option value="">
                      -- Sélectionner --
                    </option>

                    {mentions.map((m) => (

                      <option
                        key={m.id}
                        value={m.id}
                      >
                         {m.niveau?.intitule} {m.intitule}
                      </option>

                    ))}

                  </CFormSelect>

                </CInputGroup>

              </CCol>

              {/* SEMESTRE */}
              <CCol md={6}>

                <CFormLabel>
                  Semestre *
                </CFormLabel>

                <CInputGroup>

                  <CInputGroupText>
                    <CIcon icon={cilList} />
                  </CInputGroupText>

                  <CFormSelect
                    name="semestreId"
                    value={form.semestreId}
                    onChange={handleChange}
                  >

                    <option value="">
                      -- Sélectionner --
                    </option>

                    {semestres.map((s) => (

                      <option
                        key={s.id}
                        value={s.id}
                      >
                        Semestre {s.ordre}
                      </option>

                    ))}
                  </CFormSelect>

                </CInputGroup>

              </CCol>

            </CRow>

            {/* ECUE */}
            <div className="mb-4">

              <h6 className="fw-bold mb-3">
                Sélection des ECUE
              </h6>

              <div
                className="
                  border
                  rounded
                  p-3
                  bg-light
                "
                style={{
                  maxHeight: 300,
                  overflowY: "auto",
                }}
              >

                <CRow>
                  {ecues.map((ecue) => (
                    <CCol
                      md={6}
                      key={ecue.id}
                      className="mb-2"
                    >
                      <CFormCheck
                        checked={selectedEcues.includes(
                          ecue.id
                        )}
                        onChange={() =>
                          handleEcueChange(
                            ecue.id
                          )
                        }
                        label={ecue.intitule}
                      />

                    </CCol>

                  ))}

                </CRow>

              </div>

            </div>

            {/* NOTE + CREDIT */}
            <CRow className="g-3 mb-4">

              <CCol md={6}>

                <CFormLabel>
                  Note annuelle
                </CFormLabel>

                <CInputGroup>

                  <CInputGroupText>
                    <CIcon
                      icon={cilEducation}
                    />
                  </CInputGroupText>

                  <CFormInput
                    type="number"
                    name="noteAnnee"
                    value={form.noteAnnee}
                    onChange={handleChange}
                    placeholder="0"
                  />

                </CInputGroup>

              </CCol>

              <CCol md={6}>

                <CFormLabel>
                  Crédit
                </CFormLabel>

                <CInputGroup>

                  <CInputGroupText>
                    <CIcon
                      icon={cilEducation}
                    />
                  </CInputGroupText>

                  <CFormInput
                    type="number"
                    step="0.5"
                    name="credit"
                    value={form.credit}
                    onChange={handleChange}
                    placeholder="0"
                  />

                </CInputGroup>

              </CCol>

            </CRow>

            {/* BUTTONS */}
            <div
              className="
                d-flex
                justify-content-center
                gap-3
              "
            >

              <CButton
                type="submit"
                color="primary"
                disabled={!isValid || saving}
                style={{ width: 220 }}
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

                {dataToEdit
                  ? "Modifier"
                  : "Enregistrer"}

              </CButton>

              <CButton
                color="secondary"
                variant="outline"
                onClick={() => navigate(-1)}
                style={{ width: 220 }}
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