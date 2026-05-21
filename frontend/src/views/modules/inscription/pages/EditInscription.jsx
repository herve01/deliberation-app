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
} from "@coreui/icons";

import { useNavigate, useLocation } from "react-router-dom";

import { isValidName, isValidPhone } from "@src/shared/validators";

import inscriptionService from "@src/infrastructure/services/inscription/inscriptionService";
import paysService from "@src/infrastructure/services/setting/paysService";

import { useToast } from "@src/app/context/ToastContext";

export default function EditInscription() {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState("");

  const [pays, setPays] = useState([]);

  const today = new Date();
  const formattedDate = today.toLocaleDateString("fr-FR");

  const inscriptionToEdit = location.state?.inscription;
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
    domaineId: String(param?.domaineId || ""),
    filiereId: String(param?.filiereId || ""),
    mentionId: String(param?.mentionId || ""),
    anneeId: String(param?.anneeId || ""),
    date: formattedDate,
    estNouvelle: 1,
    photo: "",
  });

  // LOAD
  useEffect(() => {
    async function load() {
      try {
        setInitialLoading(true);

        const paysData = await paysService.getAll();
        setPays(paysData);

        if (inscriptionToEdit) {
          setForm({
            matricule: inscriptionToEdit.etudiant?.matricule || "",
            nom: inscriptionToEdit.etudiant?.nom || "",
            postnom: inscriptionToEdit.etudiant?.postnom || "",
            prenom: inscriptionToEdit.etudiant?.prenom || "",
            sexe: inscriptionToEdit.etudiant?.sexe || "Homme",
            paysNaissanceId: String(inscriptionToEdit.etudiant?.paysNaissanceId || ""),
            lieuNaissance: inscriptionToEdit.etudiant?.lieuNaissance || "",
            dateNaissance: inscriptionToEdit.etudiant?.dateNaissance || "",
            telephone: inscriptionToEdit.etudiant?.telephone || "",
            domaineId: String(inscriptionToEdit.mention?.filiere?.domaine?.id || ""),
            filiereId: String(inscriptionToEdit.mention?.filiere?.id || ""),
            mentionId: String(inscriptionToEdit.mention?.id || ""),
            anneeId: String(inscriptionToEdit.annee?.id || ""),
            estNouvelle: inscriptionToEdit.estNouvelle || 1,
            photo: inscriptionToEdit.photo || "",
          });
        }
      } catch (e) {
        setError("Impossible de charger les données");
      } finally {
        setInitialLoading(false);
      }
    }

    load();
  }, [inscriptionToEdit]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handlePhotoImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, photo: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement("video");
      video.srcObject = stream;
      await video.play();

      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0);

      const image = canvas.toDataURL("image/png");

      setForm((prev) => ({ ...prev, photo: image }));

      stream.getTracks().forEach((t) => t.stop());
    } catch (e) {
      showToast("Impossible d'accéder à la caméra", "error");
    }
  };

  const removePhoto = () => {
    setForm((prev) => ({ ...prev, photo: "" }));
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
        etudiant: {
          matricule: form.matricule,
          nom: form.nom,
          postnom: form.postnom,
          prenom: form.prenom,
          sexe: form.sexe,
          paysNaissanceId: form.paysNaissanceId,
          lieuNaissance: form.lieuNaissance,
          dateNaissance: form.dateNaissance,
          telephone: form.telephone,
        },
        inscription: {
          anneeId: form.anneeId,
          mentionId: form.mentionId,
          estNouvelle: form.estNouvelle,
          photo: form.photo,
        },
      };

      if (inscriptionToEdit?.id) {
        await inscriptionService.updateWithEtudiant(inscriptionToEdit.id, data);
      } else {
        await inscriptionService.addWithEtudiant(data);
      }

      showToast("Inscription enregistrée avec succès", "success");

      setTimeout(() => navigate("/inscription/list"), 1200);
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
            {inscriptionToEdit
              ? "Modifier inscription"
              : "Ajouter inscription"}
          </h5>
          <small className="text-medium-emphasis">
            Gestion des inscriptions
          </small>
        </div>
      </CCardHeader>

      <CCardBody>

        {error && <CAlert color="danger">{error}</CAlert>}

        <CForm onSubmit={handleSubmit}>

          <CRow>

            {/* PHOTO */}
            <CCol md={3} className="mb-3">
              <div className="border rounded p-3 text-center">

                {form.photo ? (
                  <CImage src={form.photo} fluid className="mb-3" />
                ) : (
                  <div className="bg-light p-5 mb-3">Aucune photo</div>
                )}

                <input
                  type="file"
                  hidden
                  ref={fileInputRef}
                  onChange={handlePhotoImport}
                />

                <div className="d-grid gap-2">

                  <CButton
                    color="primary"
                    variant="outline"
                    onClick={() => fileInputRef.current.click()}
                  >
                    <CIcon icon={cilCloudUpload} className="me-2" />
                    Importer
                  </CButton>

                  <CButton
                    color="info"
                    variant="outline"
                    onClick={handleCameraCapture}
                  >
                    <CIcon icon={cilCamera} className="me-2" />
                    Capturer
                  </CButton>

                  {form.photo && (
                    <CButton
                      color="danger"
                      variant="outline"
                      onClick={removePhoto}
                    >
                      <CIcon icon={cilTrash} className="me-2" />
                      Supprimer
                    </CButton>
                  )}

                </div>
              </div>
            </CCol>

            {/* FORM */}
            <CCol md={9}>
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

                {/* PAYS */}
                <CCol md={4} className="mb-3">
                  <CFormLabel>Pays</CFormLabel>
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
                {inscriptionToEdit ? "Modifier" : "Enregistrer"}
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