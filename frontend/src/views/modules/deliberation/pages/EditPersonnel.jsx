import React, { useEffect, useRef, useState } from "react";

import {
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CRow,
  CCol,
  CButton,
  CFormInput,
  CFormSelect,
  CFormLabel,
  CAlert,
  CSpinner,
  CImage,
  CFormFeedback,
  CInputGroup,
  CInputGroupText,
} from "@coreui/react";

import CIcon from "@coreui/icons-react";

import {
  cilCheckCircle,
  cilArrowLeft,
  cilCamera,
  cilCloudUpload,
  cilTrash,
  cilUser,
  cilPhone,
  cilGlobeAlt,
  cilBirthdayCake,
    cilSave,
    cilXCircle,
    cilBadge,
    cilPeople,
} from "@coreui/icons";

import { useNavigate, useLocation } from "react-router-dom";

import { isValidName, isValidPhone } from "@src/shared/validators";

import personnelService from "@src/infrastructure/services/deliberation/personnelService";
import paysService from "@src/infrastructure/services/setting/paysService";

import { useToast } from "@src/app/context/ToastContext";

export default function EditInscription() {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState("");

  const [pays, setPays] = useState([]);

  const today = new Date();
  const formattedDate = today.toLocaleDateString("fr-FR");

  const personnelToEdit = location.state?.personnel;
  const param = location.state?.param || {};

  const [form, setForm] = useState({
    matricule: "",
    nom: "",
    postnom: "",
    prenom: "",
    sexe: "Homme",
    paysNaissanceId: "",
    lieuNaissance: "",
    dateNaissance: "",
    telephone: "",
    grade: "",
    matricule: "",
  });

  // LOAD
  useEffect(() => {
    async function load() {
      try {
        setInitialLoading(true);

        const paysData = await paysService.getAll();
        setPays(paysData);

        if (personnelToEdit) {
          setForm({
            matricule: personnelToEdit?.matricule || "",
            nom: personnelToEdit?.nom || "",
            postnom: personnelToEdit?.postnom || "",
            prenom: personnelToEdit?.prenom || "",
            sexe: personnelToEdit?.sexe || "Homme",
            paysNaissanceId: String(personnelToEdit?.paysNaissance?.id || ""),
            lieuNaissance: personnelToEdit?.lieuNaissance || "",
            dateNaissance: personnelToEdit?.dateNaissance || "",
            telephone: personnelToEdit?.telephone || "",
            grade: personnelToEdit?.grade || "",
            matricule: personnelToEdit?.grade || "",
          });
        }
      } catch (e) {
        setError("Impossible de charger les données");
      } finally {
        setInitialLoading(false);
      }
    }

    load();
  }, [personnelToEdit]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };





  const isValid =
    form.nom &&
    isValidName(form.nom) &&
    form.postnom &&
    isValidName(form.postnom) &&
    form.prenom &&
    isValidName(form.prenom) &&
    form.dateNaissance;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValid) {
      showToast("Veuillez remplir les champs obligatoires", "warning");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = {
          matricule: form.matricule,
          nom: form.nom,
          postnom: form.postnom,
          prenom: form.prenom,
          sexe: form.sexe,
          paysNaissanceId: form.paysNaissanceId,
          lieuNaissance: form.lieuNaissance,
          dateNaissance: form.dateNaissance,
          telephone: form.telephone,
          grade: form.grade
      };

      if (personnelToEdit?.id) {
        await personnelService.update(personnelToEdit.id, data);
      } else {
        await personnelService.add(data);
      }

      showToast("personnel enregistrée avec succès", "success");

      setTimeout(() => navigate("/deliberation/personnel"), 1200);
    } catch (err) {
      setError("Erreur lors de l'enregistrement");
      showToast("Erreur lors de l'enregistrement", "error");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="text-center mt-5">
        <CSpinner color="primary" />
      </div>
    );
  }

  return (
    <CCard className="shadow-sm border-1">

      <CCardHeader className="bg-light">
        <div>
          <h5 className="mb-0 fw-bold">
            {personnelToEdit
              ? "Modifier personnel"
              : "Ajouter personnel"}
          </h5>
          <small className="text-medium-emphasis">
            Gestion des personnels
          </small>
        </div>
      </CCardHeader>

      <CCardBody>

        {error && <CAlert color="danger">{error}</CAlert>}

        <CForm onSubmit={handleSubmit}>

          <CRow>

            {/* FORM */}
            <CCol md={12}>
              <CRow>

                {/* NOM */}
                <CCol md={4} className="mb-3">
                  <CFormLabel>Nom *</CFormLabel>
                  <CInputGroup>
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      value={form.nom}
                      onChange={handleChange("nom")}
                      invalid={!isValidName(form.nom)}
                    />
                  </CInputGroup>
                  <CFormFeedback invalid>Nom invalide</CFormFeedback>
                </CCol>

                {/* POSTNOM */}
                <CCol md={4} className="mb-3">
                  <CFormLabel>Post-nom *</CFormLabel>
                  <CFormInput
                    value={form.postnom}
                    onChange={handleChange("postnom")}
                    invalid={!isValidName(form.postnom)}
                  />
                </CCol>

                {/* PRENOM */}
                <CCol md={4} className="mb-3">
                  <CFormLabel>Prénom *</CFormLabel>
                  <CFormInput
                    value={form.prenom}
                    onChange={handleChange("prenom")}
                    invalid={!isValidName(form.prenom)}
                  />
                </CCol>

                {/* SEXE */}
                <CCol md={4} className="mb-3">
                  <CFormLabel>Sexe</CFormLabel>

                  <CInputGroup>
                    <CInputGroupText>
                      <CIcon icon={cilPeople} />
                    </CInputGroupText>

                    <CFormSelect
                      value={form.sexe}
                      onChange={handleChange("sexe")}
                    >
                      <option value="">Choisir</option>
                      <option value="Homme">Homme</option>
                      <option value="Femme">Femme</option>
                    </CFormSelect>
                  </CInputGroup>
                </CCol>

                {/* TELEPHONE */}
                <CCol md={4} className="mb-3">
                  <CFormLabel>Téléphone</CFormLabel>
                  <CInputGroup>
                    <CInputGroupText>
                      <CIcon icon={cilPhone} />
                    </CInputGroupText>
                    <CFormInput
                      value={form.telephone}
                      onChange={handleChange("telephone")}
                      invalid={form.telephone && !isValidPhone(form.telephone)}
                    />
                  </CInputGroup>
                </CCol>

              {/* Matricule */}
                <CCol md={4} className="mb-3">
                  <CFormLabel>Matricule</CFormLabel>
                  <CInputGroup>
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      value={form.matricule}
                      onChange={handleChange("matricule")}
                    />
                  </CInputGroup>
                </CCol>

                {/* PAYS */}
                <CCol md={4} className="mb-3">
                  <CFormLabel>Pays de naissance</CFormLabel>
                  <CInputGroup>
                    <CInputGroupText>
                      <CIcon icon={cilGlobeAlt} />
                    </CInputGroupText>

                    <CFormSelect
                      value={form.paysNaissanceId}
                      onChange={handleChange("paysNaissanceId")}
                    >
                      <option value="">Choisir</option>
                      {pays.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.nom}
                        </option>
                      ))}
                    </CFormSelect>
                  </CInputGroup>
                </CCol>

                {/* LIEU DE NAISSANCE */}
                <CCol md={4} className="mb-3">
                  <CFormLabel>Lieu de naissance *</CFormLabel>
                  <CFormInput
                    value={form.lieuNaissance}
                    onChange={handleChange("lieuNaissance")}
                    invalid={form.lieuNaissance && !isValidName(form.lieuNaissance)}
                  />
                </CCol>
                {/* DATE */}
                <CCol md={4} className="mb-3">
                  <CFormLabel>Date naissance *</CFormLabel>
                  <CInputGroup>
                    <CInputGroupText>
                      <CIcon icon={cilBirthdayCake} />
                    </CInputGroupText>
                    <CFormInput
                      type="date"
                      value={form.dateNaissance}
                      onChange={handleChange("dateNaissance")}
                    />
                  </CInputGroup>
                </CCol>

                {/* Grade */}
                <CCol md={4} className="mb-3">
                  <CFormLabel>Grade</CFormLabel>
                  <CInputGroup>
                    <CInputGroupText>
                      <CIcon icon={cilBadge} />
                    </CInputGroupText>
                    <CFormInput
                      value={form.grade}
                      onChange={handleChange("grade")}
                    />
                  </CInputGroup>
                </CCol>

              </CRow>
            </CCol>
          </CRow>

          {/* BUTTONS */}

          <div className="d-flex justify-content-center gap-3">

              <CButton
                type="submit"
                color="primary"
                style={{ width: 220 }}
                disabled={!isValid}
              >
                <CIcon icon={cilSave} className="me-2" />
                {personnelToEdit ? "Modifier" : "Enregistrer"}
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