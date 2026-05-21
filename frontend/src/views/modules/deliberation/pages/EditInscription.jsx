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
} from "@coreui/react";

import CIcon from "@coreui/icons-react";

import {
  cilCheckCircle,
  cilArrowLeft,
  cilCamera,
  cilCloudUpload,
  cilTrash,
} from "@coreui/icons";

import {
  useNavigate,
  useLocation,
} from "react-router-dom";

import {
  isValidName,
  isValidPhone,
} from "@src/shared/validators";

import inscriptionService from "@src/infrastructure/services/inscription/inscriptionService";

import domaineService from "@src/infrastructure/services/inscription/domaineService";
import filiereService from "@src/infrastructure/services/inscription/filiereService";
import mentionService from "@src/infrastructure/services/inscription/mentionService";
import anneeService from "@src/infrastructure/services/inscription/anneeService";
import paysService from "@src/infrastructure/services/setting/paysService";

import { useToast } from "@src/app/context/ToastContext";

export default function EditInscription() {

  const navigate = useNavigate();

  const location = useLocation();

  const { showToast } = useToast();

  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(false);

  const [initialLoading, setInitialLoading] =
    useState(true);

  const [error, setError] = useState("");

  // DATA
  const [annees, setAnnees] = useState([]);

  const [pays, setPays] = useState([]);

  const [domaines, setDomaines] = useState([]);

  const [filieres, setFilieres] = useState([]);

  const [mentions, setMentions] = useState([]);

  const today = new Date();
  const formattedDate = today.toLocaleDateString("fr-FR");

  const inscriptionToEdit =
    location.state?.inscription;

  const [form, setForm] = useState({
    // ETUDIANT
    matricule: "",
    nom: "",
    postnom: "",
    prenom: "",
    sexe: "Homme",

    paysNaissanceId: "",
    lieuNaissance: "",
    dateNaissance: "",
    telephone: "",

    // CURSUS
    domaineId: "",
    filiereId: "",
    mentionId: "",

    // INSCRIPTION
    anneeId: "",
    date:formattedDate,
    estNouvelle: 1,
    photo: "",
  });

  // LOAD INITIAL
  useEffect(() => {

    async function load() {

      try {

        setInitialLoading(true);

        const [
          paysData,
          domainesData,
          anneesData,
        ] = await Promise.all([
          paysService.getAll(),
          domaineService.getAll(),
          anneeService.getAll(),
        ]);

        setPays(paysData);

        setDomaines(domainesData);

        setAnnees(anneesData);

        // EDIT MODE
        if (inscriptionToEdit) {

          const data = {
            matricule:
              inscriptionToEdit.etudiant?.matricule || "",
            nom:
              inscriptionToEdit.etudiant?.nom || "",
            postnom:
              inscriptionToEdit.etudiant?.postnom || "",
            prenom:
              inscriptionToEdit.etudiant?.prenom || "",
            sexe:
              inscriptionToEdit.etudiant?.sexe || "Homme",
            paysNaissanceId:
              String(
                inscriptionToEdit.etudiant?.paysNaissanceId || ""
              ),
            lieuNaissance:
              inscriptionToEdit.etudiant?.lieuNaissance || "",
            dateNaissance:
              inscriptionToEdit.etudiant?.dateNaissance || "",
            telephone:
              inscriptionToEdit.etudiant?.telephone || "",
            domaineId:
              String(
                inscriptionToEdit.mention?.filiere?.domaine?.id || ""
              ),
            filiereId:
              String(
                inscriptionToEdit.mention?.filiere?.id || ""
              ),
            mentionId:
              String(
                inscriptionToEdit.mention?.id || ""
              ),
            anneeId:
              String(
                inscriptionToEdit.annee?.id || ""
              ),
            estNouvelle:
              inscriptionToEdit.estNouvelle || 1,
            photo:
              inscriptionToEdit.photo || "",
          };

          setForm(data);
        }

      } catch (e) {
        console.error(e);
        setError(
          "Impossible de charger les données"
        );

      } finally {
        setInitialLoading(false);
      }
    }

    load();

  }, [inscriptionToEdit]);

  // LOAD FILIERES
  useEffect(() => {

    async function loadFilieres() {

      if (!form.domaineId) {
        setFilieres([]);
        return;
      }
      try {

        const data =
          await filiereService.getAll(
            form.domaineId
          );
        setFilieres(data);
      } catch (e) {
        console.error(e);
      }
    }

    loadFilieres();
  }, [form.domaineId]);

  // LOAD MENTIONS
  useEffect(() => {

    async function loadMentions() {
      if (!form.filiereId) {
        setMentions([]);
        return;
      }
      try {
        const data =
          await mentionService.getAllByFiliere(
            form.filiereId
          );
        setMentions(data);
      } catch (e) {
        console.error(e);
      }
    }
    loadMentions();
  }, [form.filiereId]);

  // HANDLE CHANGE
  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setForm((prev) => ({
      ...prev,
      [field]: value,

      ...(field === "domaineId" && {
        filiereId: "",
        mentionId: "",
      }),

      ...(field === "filiereId" && {
        mentionId: "",
      }),
    }));
  };

  // PHOTO IMPORT
  const handlePhotoImport = (e) => {

    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({
        ...prev,
        photo: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  };

  // CAMERA
  const handleCameraCapture = async () => {

    try {

      const stream =
        await navigator.mediaDevices.getUserMedia({
          video: true,
        });

      const video =
        document.createElement("video");

      video.srcObject = stream;

      await video.play();

      const canvas =
        document.createElement("canvas");

      canvas.width = video.videoWidth;

      canvas.height = video.videoHeight;

      const ctx =
        canvas.getContext("2d");

      ctx.drawImage(
        video,
        0,
        0,
        canvas.width,
        canvas.height
      );

      const image =
        canvas.toDataURL("image/png");

      setForm((prev) => ({
        ...prev,
        photo: image,
      }));

      stream
        .getTracks()
        .forEach((track) =>
          track.stop()
        );

    } catch (e) {

      console.error(e);

      showToast(
        "Impossible d'accéder à la caméra",
        "error"
      );
    }
  };

  // REMOVE PHOTO
  const removePhoto = () => {

    setForm((prev) => ({
      ...prev,
      photo: "",
    }));
  };

  // VALIDATION
  const isValid =
    form.nom &&
    isValidName(form.nom) &&
    form.postnom &&
    isValidName(form.postnom) &&
    form.prenom &&
    isValidName(form.prenom) &&
    form.dateNaissance &&
    form.anneeId &&
    form.domaineId &&
    form.filiereId &&
    form.mentionId;

  // SUBMIT
  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!isValid) {

      showToast(
        "Veuillez remplir les champs obligatoires",
        "warning"
      );

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
          paysNaissanceId:
            form.paysNaissanceId,
          lieuNaissance:
            form.lieuNaissance,
          dateNaissance:
            form.dateNaissance,
          telephone:
            form.telephone,
        },

        inscription: {
          anneeId:
            form.anneeId,

          mentionId:
            form.mentionId,

          estNouvelle:
            form.estNouvelle,

          photo:
            form.photo,
        },
      };

      // UPDATE
      if (inscriptionToEdit?.id) {

        await inscriptionService.updateWithEtudiant(
          inscriptionToEdit.id,
          data
        );

      } else {

        // CREATE
        await inscriptionService.addWithEtudiant(
          data
        );
      }

      showToast(
        "Inscription enregistrée avec succès",
        "success"
      );

      setTimeout(() => {

        navigate("/inscription/list");

      }, 1500);

    } catch (err) {

      console.error(err);

      setError(
        "Erreur lors de l'enregistrement"
      );

      showToast(
        "Une erreur est survenue",
        "error"
      );

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

    <CCard className="border-1 shadow-sm">

      <CCardHeader>
        <strong>
          Formulaire d'inscription
        </strong>
      </CCardHeader>

      <CCardBody>

        {error && (
          <CAlert color="danger">
            {error}
          </CAlert>
        )}

        <CForm onSubmit={handleSubmit}>

          <CRow>

            {/* PHOTO */}
            <CCol md={3} className="mb-4">

              <div className="border rounded p-3 text-center h-100">

                {form.photo ? (

                  <CImage
                    src={form.photo}
                    fluid
                    rounded
                    className="mb-3"
                    style={{
                      height: 260,
                      width: "100%",
                      objectFit: "cover",
                    }}
                  />

                ) : (

                  <div
                    className="d-flex align-items-center justify-content-center border rounded mb-3"
                    style={{
                      height: 260,
                      background: "#f8f9fa",
                    }}
                  >
                    Aucune photo
                  </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  hidden
                  onChange={handlePhotoImport}
                />

                <div className="d-grid gap-2">

                  <CButton
                    color="primary"
                    variant="outline"
                    onClick={() =>
                      fileInputRef.current.click()
                    }
                  >
                    <CIcon
                      icon={cilCloudUpload}
                      className="me-2"
                    />

                    Importer
                  </CButton>

                  <CButton
                    color="info"
                    variant="outline"
                    onClick={handleCameraCapture}
                  >
                    <CIcon
                      icon={cilCamera}
                      className="me-2"
                    />

                    Capturer
                  </CButton>

                  {form.photo && (

                    <CButton
                      color="danger"
                      variant="outline"
                      onClick={removePhoto}
                    >
                      <CIcon
                        icon={cilTrash}
                        className="me-2"
                      />

                      Supprimer
                    </CButton>
                  )}

                </div>

              </div>

            </CCol>

            {/* FORM */}
            <CCol md={9}>

              <CRow>

                {/* MATRICULE */}
                <CCol md={4} className="mb-3">

                  <CFormLabel>
                    Matricule
                  </CFormLabel>

                  <CFormInput
                    value={form.matricule}
                    onChange={handleChange("matricule")}
                  />

                </CCol>

                {/* NOM */}
                <CCol md={4} className="mb-3">

                  <CFormLabel>
                    Nom *
                  </CFormLabel>

                  <CFormInput
                    value={form.nom}
                    onChange={handleChange("nom")}
                    invalid={
                      form.nom &&
                      !isValidName(form.nom)
                    }
                  />

                  <CFormFeedback invalid>
                    Nom invalide
                  </CFormFeedback>

                </CCol>

                {/* POSTNOM */}
                <CCol md={4} className="mb-3">

                  <CFormLabel>
                    Post-nom *
                  </CFormLabel>

                  <CFormInput
                    value={form.postnom}
                    onChange={handleChange("postnom")}
                    invalid={
                      form.postnom &&
                      !isValidName(form.postnom)
                    }
                  />

                  <CFormFeedback invalid>
                    Post-nom invalide
                  </CFormFeedback>

                </CCol>

                {/* PRENOM */}
                <CCol md={4} className="mb-3">

                  <CFormLabel>
                    Prénom *
                  </CFormLabel>

                  <CFormInput
                    value={form.prenom}
                    onChange={handleChange("prenom")}
                    invalid={
                      form.prenom &&
                      !isValidName(form.prenom)
                    }
                  />

                  <CFormFeedback invalid>
                    Prénom invalide
                  </CFormFeedback>

                </CCol>

                {/* SEXE */}
                <CCol md={4} className="mb-3">

                  <CFormLabel>
                    Sexe
                  </CFormLabel>

                  <CFormSelect
                    value={form.sexe}
                    onChange={handleChange("sexe")}
                  >
                    <option value="Homme">
                      Homme
                    </option>

                    <option value="Femme">
                      Femme
                    </option>

                  </CFormSelect>

                </CCol>

                {/* TELEPHONE */}
                <CCol md={4} className="mb-3">

                  <CFormLabel>
                    Téléphone
                  </CFormLabel>

                  <CFormInput
                    value={form.telephone}
                    onChange={handleChange("telephone")}
                    invalid={
                      form.telephone &&
                      !isValidPhone(form.telephone)
                    }
                  />

                  <CFormFeedback invalid>
                    Numéro invalide
                  </CFormFeedback>

                </CCol>

                {/* PAYS */}
                <CCol md={4} className="mb-3">

                  <CFormLabel>
                    Pays de naissance *
                  </CFormLabel>

                  <CFormSelect
                    value={form.paysNaissanceId}
                    onChange={handleChange(
                      "paysNaissanceId"
                    )}
                  >
                    <option value="">
                      Choisir un pays
                    </option>

                    {pays.map((p) => (
                      <option
                        key={p.id}
                        value={String(p.id)}
                      >
                        {p.nom}
                      </option>
                    ))}

                  </CFormSelect>

                </CCol>

                {/* LIEU */}
                <CCol md={4} className="mb-3">

                  <CFormLabel>
                    Lieu de naissance
                  </CFormLabel>

                  <CFormInput
                    value={form.lieuNaissance}
                    onChange={handleChange(
                      "lieuNaissance"
                    )}
                  />

                </CCol>

                {/* DATE */}
                <CCol md={4} className="mb-3">

                  <CFormLabel>
                    Date de naissance *
                  </CFormLabel>

                  <CFormInput
                    type="date"
                    value={form.dateNaissance}
                    onChange={handleChange(
                      "dateNaissance"
                    )}
                  />

                </CCol>

                {/* DOMAINE */}
                <CCol md={4} className="mb-3">

                  <CFormLabel>
                    Domaine *
                  </CFormLabel>

                  <CFormSelect
                    value={form.domaineId}
                    onChange={handleChange(
                      "domaineId"
                    )}
                  >
                    <option value="">
                      Choisir un domaine
                    </option>

                    {domaines.map((d) => (
                      <option
                        key={d.id}
                        value={String(d.id)}
                      >
                        {d.intitule}
                      </option>
                    ))}

                  </CFormSelect>

                </CCol>

                {/* FILIERE */}
                <CCol md={4} className="mb-3">

                  <CFormLabel>
                    Filière *
                  </CFormLabel>

                  <CFormSelect
                    value={form.filiereId}
                    onChange={handleChange(
                      "filiereId"
                    )}
                    disabled={!form.domaineId}
                  >
                    <option value="">
                      Choisir une filière
                    </option>

                    {filieres.map((f) => (
                      <option
                        key={f.id}
                        value={String(f.id)}
                      >
                        {f.intitule}
                      </option>
                    ))}

                  </CFormSelect>

                </CCol>

                {/* MENTION */}
                <CCol md={4} className="mb-3">

                  <CFormLabel>
                    Mention *
                  </CFormLabel>

                  <CFormSelect
                    value={form.mentionId}
                    onChange={handleChange(
                      "mentionId"
                    )}
                    disabled={!form.filiereId}
                  >
                    <option value="">
                      Choisir une mention
                    </option>

                    {mentions.map((m) => (
                      <option
                        key={m.id}
                        value={String(m.id)}
                      >
                        {m.intitule}{" "}
                        {m.niveau?.intitule}
                      </option>
                    ))}

                  </CFormSelect>

                </CCol>

                {/* ANNEE */}
                <CCol md={4} className="mb-3">

                  <CFormLabel>
                    Année académique *
                  </CFormLabel>

                  <CFormSelect
                    value={form.anneeId}
                    onChange={handleChange(
                      "anneeId"
                    )}
                  >
                    <option value="">
                      Choisir une année académique
                    </option>

                    {annees.map((a) => (
                      <option
                        key={a.id}
                        value={String(a.id)}
                      >
                        {a.annee}
                      </option>
                    ))}

                  </CFormSelect>

                </CCol>

              </CRow>

            </CCol>

          </CRow>

          {/* BUTTONS */}
          <div className="d-flex justify-content-center gap-3 mt-4">

            <CButton
              type="submit"
              color="primary"
              style={{ width: 220 }}
              className="d-flex align-items-center justify-content-center"
              disabled={!isValid || loading}
            >
              <CIcon
                icon={cilCheckCircle}
                className="me-2"
              />

              {loading
                ? "Enregistrement..."
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