import React, { useEffect, useState } from "react";

import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CBadge,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CSpinner,
  CProgress,
  CImage,
} from "@coreui/react";

import CIcon from "@coreui/icons-react";

import {
  cilChart,
  cilPeople,
  cilCheckCircle,
  cilXCircle,
  cilEducation,
  cilSpeedometer,
  cilNotes,
  cilStar,
} from "@coreui/icons";

const DashboardCotation = () => {

  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    etudiantsCotes: 0,
    etudiantsNonCotes: 0,
    moyenneGenerale: 0,
    tauxReussite: 0,
    admis: 0,
    ajournes: 0,
    ecueCotes: 0,
    ecueNonCotes: 0,
  });

  const [topEtudiants, setTopEtudiants] = useState([]);

  const [dernieresCotations, setDernieresCotations] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {

    try {

      setLoading(true);

      // EXEMPLE DONNÉES
      // remplacer par vos services API

      const data = [
        {
          id: 1,
          nom: "KAYEMBE",
          postnom: "MUKENDI",
          prenom: "Hervé",
          moyenne: 16.5,
          mention: "L2 Génie Logiciel",
          decision: "ADMIS",
          ecue: "Programmation Web",
          note: 18,
          photo: null,
        },
        {
          id: 2,
          nom: "MUTOMBO",
          postnom: "KABONGO",
          prenom: "Sarah",
          moyenne: 12.4,
          mention: "L1 Informatique",
          decision: "ADMIS",
          ecue: "Base de données",
          note: 13,
          photo: null,
        },
        {
          id: 3,
          nom: "ILUNGA",
          postnom: "TSHIBOLA",
          prenom: "David",
          moyenne: 8.3,
          mention: "L3 Réseaux",
          decision: "AJOURNÉ",
          ecue: "Réseaux II",
          note: 7,
          photo: null,
        },
      ];

      setStats({
        etudiantsCotes: 320,
        etudiantsNonCotes: 45,
        moyenneGenerale: 12.8,
        tauxReussite: 78,
        admis: 250,
        ajournes: 70,
        ecueCotes: 48,
        ecueNonCotes: 6,
      });

      setTopEtudiants(
        [...data].sort(
          (a, b) => b.moyenne - a.moyenne
        )
      );

      setDernieresCotations(data);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  };

  const StatCard = ({
    title,
    value,
    color,
    icon,
    progress,
  }) => (
    <CCard
      className="border-0 shadow-sm h-100"
      style={{
        borderRadius: 18,
      }}
    >
      <CCardBody>

        <div className="d-flex justify-content-between align-items-start mb-3">

          <div>

            <div
              className="text-medium-emphasis fw-semibold mb-2"
              style={{
                fontSize: 13,
              }}
            >
              {title}
            </div>

            <h2 className="fw-bold mb-0">
              {value}
            </h2>

          </div>

          <div
            className={`bg-${color} bg-opacity-10 d-flex align-items-center justify-content-center`}
            style={{
              width: 60,
              height: 60,
              borderRadius: 16,
            }}
          >
            <CIcon
              icon={icon}
              className={`text-${color}`}
              size="xl"
            />
          </div>

        </div>

        <div className="d-flex justify-content-between mb-2">

          <small className="text-medium-emphasis">
            Progression
          </small>

          <small className={`text-${color} fw-semibold`}>
            {progress}%
          </small>

        </div>

        <CProgress
          thin
          color={color}
          value={progress}
        />

      </CCardBody>
    </CCard>
  );

  const getDecisionBadge = (decision) => {

    if (decision === "ADMIS") {
      return (
        <CBadge color="success">
          ADMIS
        </CBadge>
      );
    }

    return (
      <CBadge color="danger">
        AJOURNÉ
      </CBadge>
    );

  };

  const getMoyenneColor = (moyenne) => {

    if (moyenne >= 14) return "success";

    if (moyenne >= 10) return "warning";

    return "danger";

  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          height: "70vh",
        }}
      >
        <CSpinner color="primary" />
      </div>
    );
  }

  return (
    <div className="container-fluid px-3">

      {/* HEADER */}

      <div
        className="mb-4 p-4 shadow-sm"
        style={{
          borderRadius: 20,
          background:
            "linear-gradient(135deg,#1e3c72 0%,#2a5298 100%)",
          color: "#fff",
        }}
      >

        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">

          <div>

            <h2 className="fw-bold mb-2">
              Dashboard Cotation
            </h2>

            <div
              style={{
                opacity: 0.9,
              }}
            >
              Gestion académique des résultats étudiants
            </div>

          </div>

          <div
            className="px-4 py-3"
            style={{
              background: "rgba(255,255,255,0.15)",
              borderRadius: 16,
            }}
          >

            <div className="small">
              Année académique
            </div>

            <div className="fw-bold fs-5">
              2025 - 2026
            </div>

          </div>

        </div>

      </div>

      {/* STATS */}

      <CRow className="g-4 mb-4">

        <CCol xs={12} sm={6} xl={3}>
          <StatCard
            title="Étudiants cotés"
            value={stats.etudiantsCotes}
            color="primary"
            icon={cilPeople}
            progress={88}
          />
        </CCol>

        <CCol xs={12} sm={6} xl={3}>
          <StatCard
            title="Non cotés"
            value={stats.etudiantsNonCotes}
            color="warning"
            icon={cilNotes}
            progress={35}
          />
        </CCol>

        <CCol xs={12} sm={6} xl={3}>
          <StatCard
            title="Moyenne générale"
            value={stats.moyenneGenerale}
            color="success"
            icon={cilChart}
            progress={78}
          />
        </CCol>

        <CCol xs={12} sm={6} xl={3}>
          <StatCard
            title="Taux réussite"
            value={`${stats.tauxReussite}%`}
            color="info"
            icon={cilSpeedometer}
            progress={stats.tauxReussite}
          />
        </CCol>

      </CRow>

      {/* SECOND STATS */}

      <CRow className="g-4 mb-4">

        <CCol xs={12} sm={6} xl={3}>
          <StatCard
            title="Admis"
            value={stats.admis}
            color="success"
            icon={cilCheckCircle}
            progress={85}
          />
        </CCol>

        <CCol xs={12} sm={6} xl={3}>
          <StatCard
            title="Ajournés"
            value={stats.ajournes}
            color="danger"
            icon={cilXCircle}
            progress={30}
          />
        </CCol>

        <CCol xs={12} sm={6} xl={3}>
          <StatCard
            title="ECUE cotés"
            value={stats.ecueCotes}
            color="primary"
            icon={cilEducation}
            progress={90}
          />
        </CCol>

        <CCol xs={12} sm={6} xl={3}>
          <StatCard
            title="ECUE non cotés"
            value={stats.ecueNonCotes}
            color="warning"
            icon={cilNotes}
            progress={22}
          />
        </CCol>

      </CRow>

      {/* TOP ETUDIANTS */}

      <CRow className="g-4 mb-4">

        <CCol xs={12} lg={7}>

          <CCard
            className="border-0 shadow-sm"
            style={{
              borderRadius: 20,
            }}
          >

            <CCardHeader className="bg-white border-0 py-4">

              <div className="d-flex align-items-center gap-2">

                <CIcon
                  icon={cilStar}
                  className="text-warning"
                />

                <h5 className="mb-0 fw-bold">
                  Top Étudiants
                </h5>

              </div>

            </CCardHeader>

            <CCardBody>

              <CTable
                hover
                responsive
                align="middle"
                className="mb-0"
              >

                <CTableHead>

                  <CTableRow>

                    <CTableHeaderCell>
                      Étudiant
                    </CTableHeaderCell>

                    <CTableHeaderCell>
                      Mention
                    </CTableHeaderCell>

                    <CTableHeaderCell>
                      Moyenne
                    </CTableHeaderCell>

                    <CTableHeaderCell>
                      Décision
                    </CTableHeaderCell>

                  </CTableRow>

                </CTableHead>

                <CTableBody>

                  {topEtudiants.map((i) => (

                    <CTableRow key={i.id}>

                      <CTableDataCell>

                        <div className="d-flex align-items-center gap-3">

                          <div
                            className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white"
                            style={{
                              width: 50,
                              height: 50,
                              background:
                                "linear-gradient(135deg,#4e73df,#224abe)",
                            }}
                          >
                            {`${i.prenom.charAt(0)}${i.nom.charAt(0)}`}
                          </div>

                          <div>

                            <div className="fw-semibold">
                              {i.nom} {i.postnom} {i.prenom}
                            </div>

                          </div>

                        </div>

                      </CTableDataCell>

                      <CTableDataCell>
                        {i.mention}
                      </CTableDataCell>

                      <CTableDataCell>

                        <CBadge
                          color={getMoyenneColor(i.moyenne)}
                        >
                          {i.moyenne}/20
                        </CBadge>

                      </CTableDataCell>

                      <CTableDataCell>
                        {getDecisionBadge(i.decision)}
                      </CTableDataCell>

                    </CTableRow>

                  ))}

                </CTableBody>

              </CTable>

            </CCardBody>

          </CCard>

        </CCol>

        {/* PROGRESSION */}

        <CCol xs={12} lg={5}>

          <CCard
            className="border-0 shadow-sm h-100"
            style={{
              borderRadius: 20,
            }}
          >

            <CCardHeader className="bg-white border-0 py-4">

              <h5 className="fw-bold mb-0">
                Progression des cotations
              </h5>

            </CCardHeader>

            <CCardBody>

              <div className="mb-4">

                <div className="d-flex justify-content-between mb-2">

                  <span>
                    Notes encodées
                  </span>

                  <strong>
                    78%
                  </strong>

                </div>

                <CProgress
                  value={78}
                  color="success"
                />

              </div>

              <div className="mb-4">

                <div className="d-flex justify-content-between mb-2">

                  <span>
                    ECUE validés
                  </span>

                  <strong>
                    90%
                  </strong>

                </div>

                <CProgress
                  value={90}
                  color="primary"
                />

              </div>

              <div className="mb-4">

                <div className="d-flex justify-content-between mb-2">

                  <span>
                    Délibérations
                  </span>

                  <strong>
                    65%
                  </strong>

                </div>

                <CProgress
                  value={65}
                  color="warning"
                />

              </div>

            </CCardBody>

          </CCard>

        </CCol>

      </CRow>

      {/* DERNIERES COTATIONS */}

      <CCard
        className="border-0 shadow-sm"
        style={{
          borderRadius: 20,
        }}
      >

        <CCardHeader className="bg-white border-0 py-4">

          <h5 className="fw-bold mb-0">
            Dernières cotations
          </h5>

        </CCardHeader>

        <CCardBody>

          <CTable
            hover
            responsive
            align="middle"
            className="mb-0"
          >

            <CTableHead>

              <CTableRow>

                <CTableHeaderCell>
                  Étudiant
                </CTableHeaderCell>

                <CTableHeaderCell>
                  ECUE
                </CTableHeaderCell>

                <CTableHeaderCell>
                  Note
                </CTableHeaderCell>

                <CTableHeaderCell>
                  Décision
                </CTableHeaderCell>

              </CTableRow>

            </CTableHead>

            <CTableBody>

              {dernieresCotations.map((i) => (

                <CTableRow key={i.id}>

                  <CTableDataCell>

                    <div className="fw-semibold">
                      {i.nom} {i.prenom}
                    </div>

                  </CTableDataCell>

                  <CTableDataCell>
                    {i.ecue}
                  </CTableDataCell>

                  <CTableDataCell>

                    <CBadge
                      color={getMoyenneColor(i.note)}
                    >
                      {i.note}/20
                    </CBadge>

                  </CTableDataCell>

                  <CTableDataCell>
                    {getDecisionBadge(i.decision)}
                  </CTableDataCell>

                </CTableRow>

              ))}

            </CTableBody>

          </CTable>

        </CCardBody>

      </CCard>

    </div>
  );

};

export default DashboardCotation;