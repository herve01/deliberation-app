import React, { useEffect, useState } from "react";

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
  CBadge,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CFormCheck,
  CSpinner,
  CImage,
} from "@coreui/react";

import CIcon from "@coreui/icons-react";

import {
  cilSearch,
  cilCheckCircle,
  cilArrowRight,
  cilArrowLeft,
  cilUser,
  cilEducation,
  cilWarning,
} from "@coreui/icons";

import { useNavigate } from "react-router-dom";

export default function Reinscription() {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  const [studentFound, setStudentFound] = useState(false);

  const [error, setError] = useState("");

  const [student, setStudent] = useState(null);

  const [form, setForm] = useState({
    anneeId: "",
    typeReinscription: "PASSAGE",
    nouvelleMention: "",
    montantPaye: "",
    modePaiement: "Cash",
  });

  // MOCK DATA
  const mockStudent = {
    matricule: "22A154",
    nom: "KAYEMBE",
    postnom: "MUKENDI",
    prenom: "Hervé",
    sexe: "Homme",
    telephone: "099999999",
    photo:
      "https://via.placeholder.com/300x350.png?text=Photo",
    ancienneMention: "L1 Génie Logiciel",
    nouvelleMention: "L2 Génie Logiciel",
    anneePrecedente: "2024-2025",
    statut: "ADMIS",
    historique: [
      {
        annee: "2023-2024",
        mention: "L1 Génie Logiciel",
        resultat: "ADMIS",
      },
      {
        annee: "2024-2025",
        mention: "L2 Génie Logiciel",
        resultat: "SESSION",
      },
    ],
  };

  // SEARCH STUDENT
  const handleSearch = async () => {

    if (!search) {
      setError("Veuillez saisir un matricule ou un nom");
      return;
    }

    try {

      setLoading(true);

      setError("");

      // API CALL HERE
      // const data = await reinscriptionService.search(search)

      setTimeout(() => {

        setStudent(mockStudent);

        setStudentFound(true);

        setForm((prev) => ({
          ...prev,
          nouvelleMention:
            mockStudent.nouvelleMention,
        }));

        setLoading(false);

      }, 1000);

    } catch (e) {

      console.error(e);

      setError(
        "Impossible de retrouver l'étudiant"
      );

      setLoading(false);

    }
  };

  // HANDLE CHANGE
  const handleChange = (field) => (e) => {

    const value = e.target.value;

    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // TYPE CHANGE
  useEffect(() => {

    if (!student) return;

    if (
      form.typeReinscription === "PASSAGE"
    ) {

      setForm((prev) => ({
        ...prev,
        nouvelleMention:
          student.nouvelleMention,
      }));

    } else {

      setForm((prev) => ({
        ...prev,
        nouvelleMention:
          student.ancienneMention,
      }));

    }

  }, [
    form.typeReinscription,
    student,
  ]);

  // SUBMIT
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      const payload = {
        etudiant_id: student.matricule,
        annee_id: form.anneeId,
        type: form.typeReinscription,
        mention: form.nouvelleMention,
        montant_paye: form.montantPaye,
        mode_paiement: form.modePaiement,
      };

      console.log(payload);

      // API
      // await reinscriptionService.save(payload)

      setTimeout(() => {

        setLoading(false);

        alert(
          "Réinscription enregistrée avec succès"
        );

      }, 1000);

    } catch (e) {

      console.error(e);

      setLoading(false);

      setError(
        "Erreur lors de l'enregistrement"
      );
    }
  };

  return (

    <CCard className="border-1 shadow-sm">

      <CCardHeader className="bg-light py-3">

        <div className="d-flex align-items-center">

          <div
            className="rounded-circle d-flex align-items-center justify-content-center me-3"
            style={{
              width: 45,
              height: 45,
              background: "#e7f1ff",
            }}
          >
            <CIcon
              icon={cilEducation}
              size="lg"
              style={{ color: "#0d6efd" }}
            />
          </div>

          <div>

            <h5 className="mb-0">
              Réinscription académique
            </h5>

            <small className="text-medium-emphasis">
              Réinscription d'un étudiant existant
            </small>

          </div>

        </div>

      </CCardHeader>

      <CCardBody>

        {error && (
          <CAlert color="danger">
            <CIcon
              icon={cilWarning}
              className="me-2"
            />
            {error}
          </CAlert>
        )}

        {/* SEARCH */}

        <CCard className="border mb-4 shadow-sm">

          <CCardBody>

            <CRow className="align-items-end">

              <CCol md={9}>
                <CFormLabel>
                  Rechercher un étudiant
                </CFormLabel>

                <CFormInput
                  placeholder="Matricule, nom ou téléphone"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                />
              </CCol>

              <CCol md={3}>
                <CButton
                  color="primary"
                  className="w-100"
                  onClick={handleSearch}
                  disabled={loading}
                >

                  {loading ? (
                    <CSpinner size="sm" />
                  ) : (
                    <>
                      <CIcon
                        icon={cilSearch}
                        className="me-2"
                      />
                      Rechercher
                    </>
                  )}

                </CButton>
              </CCol>

            </CRow>

          </CCardBody>

        </CCard>

        {/* STUDENT */}

        {studentFound && student && (

          <CForm onSubmit={handleSubmit}>

            <CRow>

              {/* LEFT */}

              <CCol md={4}>

                <CCard className="border shadow-sm mb-4">

                  <CCardBody className="text-center">

                    <CImage
                      src={student.photo}
                      rounded
                      fluid
                      className="mb-3"
                      style={{
                        height: 280,
                        width: "100%",
                        objectFit: "cover",
                      }}
                    />

                    <h5 className="mb-1">
                      {student.nom}{" "}
                      {student.postnom}
                    </h5>

                    <div className="text-medium-emphasis mb-3">
                      {student.prenom}
                    </div>

                    <CBadge
                      color="success"
                      className="px-3 py-2"
                    >
                      {student.statut}
                    </CBadge>

                    <hr />

                    <div className="text-start">

                      <p className="mb-2">
                        <strong>
                          Matricule :
                        </strong>{" "}
                        {student.matricule}
                      </p>

                      <p className="mb-2">
                        <strong>Sexe :</strong>{" "}
                        {student.sexe}
                      </p>

                      <p className="mb-2">
                        <strong>
                          Téléphone :
                        </strong>{" "}
                        {student.telephone}
                      </p>

                      <p className="mb-2">
                        <strong>
                          Ancienne mention :
                        </strong>{" "}
                        {
                          student.ancienneMention
                        }
                      </p>

                      <p className="mb-0">
                        <strong>
                          Année précédente :
                        </strong>{" "}
                        {
                          student.anneePrecedente
                        }
                      </p>

                    </div>

                  </CCardBody>

                </CCard>

              </CCol>

              {/* RIGHT */}

              <CCol md={8}>

                {/* REINSCRIPTION */}

                <CCard className="border shadow-sm mb-4">

                  <CCardHeader className="bg-light">
                    <strong>
                      Nouvelle réinscription
                    </strong>
                  </CCardHeader>

                  <CCardBody>

                    <CRow>

                      {/* ANNEE */}

                      <CCol md={6} className="mb-3">

                        <CFormLabel>
                          Année académique *
                        </CFormLabel>

                        <CFormSelect
                          value={form.anneeId}
                          onChange={handleChange(
                            "anneeId"
                          )}
                          required
                        >
                          <option value="">
                            Sélectionner
                          </option>

                          <option value="1">
                            2025-2026
                          </option>

                          <option value="2">
                            2026-2027
                          </option>

                        </CFormSelect>

                      </CCol>

                    </CRow>

                    {/* TYPE */}

                    <CRow className="mt-2">

                      <CCol md={6} className="mb-3">

                        <div
                          className={`border rounded p-4 h-100 ${
                            form.typeReinscription ===
                            "PASSAGE"
                              ? "border-primary bg-light"
                              : ""
                          }`}
                          style={{
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            setForm((prev) => ({
                              ...prev,
                              typeReinscription:
                                "PASSAGE",
                            }))
                          }
                        >

                          <CFormCheck
                            type="radio"
                            checked={
                              form.typeReinscription ===
                              "PASSAGE"
                            }
                            readOnly
                            label="Passage en mention supérieure"
                          />

                          <div className="mt-3 text-medium-emphasis">

                            L1 → L2
                            <br />
                            L2 → L3

                          </div>

                        </div>

                      </CCol>

                      <CCol md={6} className="mb-3">

                        <div
                          className={`border rounded p-4 h-100 ${
                            form.typeReinscription ===
                            "REDOUBLEMENT"
                              ? "border-warning bg-light"
                              : ""
                          }`}
                          style={{
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            setForm((prev) => ({
                              ...prev,
                              typeReinscription:
                                "REDOUBLEMENT",
                            }))
                          }
                        >

                          <CFormCheck
                            type="radio"
                            checked={
                              form.typeReinscription ===
                              "REDOUBLEMENT"
                            }
                            readOnly
                            label="Réinscription dans la même mention"
                          />

                          <div className="mt-3 text-medium-emphasis">

                            L2 → L2
                            <br />
                            L3 → L3

                          </div>

                        </div>

                      </CCol>

                    </CRow>

                    {/* FLOW */}

                    <div className="border rounded p-4 mt-3 bg-light">

                      <div className="d-flex align-items-center justify-content-center">

                        <div className="text-center">

                          <div className="fw-bold">
                            Ancienne mention
                          </div>

                          <div className="mt-2">
                            {
                              student.ancienneMention
                            }
                          </div>

                        </div>

                        <div className="mx-4">

                          <CIcon
                            icon={cilArrowRight}
                            size="xl"
                            className="text-primary"
                          />

                        </div>

                        <div className="text-center">

                          <div className="fw-bold">
                            Nouvelle mention
                          </div>

                          <div className="mt-2 text-primary fw-semibold">
                            {
                              form.nouvelleMention
                            }
                          </div>

                        </div>

                      </div>

                    </div>

                  </CCardBody>

                </CCard>

                {/* FINANCE */}

                <CCard className="border shadow-sm mb-4">

                  <CCardHeader className="bg-light">
                    <strong>
                      Informations financières
                    </strong>
                  </CCardHeader>

                  <CCardBody>

                    <CRow>

                      <CCol md={6} className="mb-3">

                        <CFormLabel>
                          Montant payé
                        </CFormLabel>

                        <CFormInput
                          type="number"
                          value={form.montantPaye}
                          onChange={handleChange(
                            "montantPaye"
                          )}
                        />

                      </CCol>

                      <CCol md={6} className="mb-3">

                        <CFormLabel>
                          Mode de paiement
                        </CFormLabel>

                        <CFormSelect
                          value={form.modePaiement}
                          onChange={handleChange(
                            "modePaiement"
                          )}
                        >

                          <option>
                            Cash
                          </option>

                          <option>
                            Mobile Money
                          </option>

                          <option>
                            Banque
                          </option>

                        </CFormSelect>

                      </CCol>

                    </CRow>

                  </CCardBody>

                </CCard>

                {/* HISTORY */}

                <CCard className="border shadow-sm mb-4">

                  <CCardHeader className="bg-light">
                    <strong>
                      Historique académique
                    </strong>
                  </CCardHeader>

                  <CCardBody>

                    <CTable hover responsive>

                      <CTableHead>

                        <CTableRow>

                          <CTableHeaderCell>
                            Année
                          </CTableHeaderCell>

                          <CTableHeaderCell>
                            Mention
                          </CTableHeaderCell>

                          <CTableHeaderCell>
                            Résultat
                          </CTableHeaderCell>

                        </CTableRow>

                      </CTableHead>

                      <CTableBody>

                        {student.historique.map(
                          (item, index) => (

                            <CTableRow key={index}>

                              <CTableDataCell>
                                {item.annee}
                              </CTableDataCell>

                              <CTableDataCell>
                                {item.mention}
                              </CTableDataCell>

                              <CTableDataCell>

                                <CBadge
                                  color={
                                    item.resultat ===
                                    "ADMIS"
                                      ? "success"
                                      : "warning"
                                  }
                                >
                                  {item.resultat}
                                </CBadge>

                              </CTableDataCell>

                            </CTableRow>

                          )
                        )}

                      </CTableBody>

                    </CTable>

                  </CCardBody>

                </CCard>

                {/* ACTIONS */}

                <div className="d-flex justify-content-center gap-3 mt-4">

                  <CButton
                    type="submit"
                    color="primary"
                    size="lg"
                    className="px-5"
                  >

                    <CIcon
                      icon={cilCheckCircle}
                      className="me-2"
                    />

                    Valider la réinscription

                  </CButton>

                  <CButton
                    type="button"
                    color="secondary"
                    size="lg"
                    variant="outline"
                    className="px-5"
                    onClick={() => navigate(-1)}
                  >

                    <CIcon
                      icon={cilArrowLeft}
                      className="me-2"
                    />

                    Annuler

                  </CButton>

                </div>

              </CCol>

            </CRow>

          </CForm>

        )}

      </CCardBody>

    </CCard>
  );
}