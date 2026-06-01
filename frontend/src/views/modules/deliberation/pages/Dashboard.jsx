import React from "react";
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CBadge,
  CProgress,
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CButton,
} from "@coreui/react";

import CIcon from "@coreui/icons-react";

import {
  cilCheckCircle,
  cilWarning,
  cilXCircle,
  cilPeople,
  cilChart,
  cilCloudDownload,
  cilPrint,
} from "@coreui/icons";

const DashboardDeliberation = () => {
  const stats = {
    inscrits: 365,
    deliberes: 320,
    restants: 45,
    admis: 250,
    ajournes: 58,
    sessionSpeciale: 12,
    tauxReussite: 78.1,
    moyennePromo: 12.84,
  };

  const limites = [
    {
      matricule: "2025001",
      nom: "KAYEMBE Hervé",
      moyenne: 9.98,
    },
    {
      matricule: "2025012",
      nom: "MUTOMBO Sarah",
      moyenne: 9.85,
    },
    {
      matricule: "2025045",
      nom: "ILUNGA David",
      moyenne: 9.72,
    },
  ];

  const ecues = [
    {
      ecue: "Programmation Java",
      moyenne: 13.5,
      taux: 85,
    },
    {
      ecue: "Réseaux II",
      moyenne: 9.8,
      taux: 45,
    },
    {
      ecue: "Base de données",
      moyenne: 11.7,
      taux: 71,
    },
  ];

  const CardStat = ({ title, value, color, icon }) => (
    <CCard className="border-0 shadow-sm h-100">
      <CCardBody>
        <div className="d-flex justify-content-between">
          <div>
            <div className="text-medium-emphasis">
              {title}
            </div>

            <h2 className="fw-bold">
              {value}
            </h2>
          </div>

          <div>
            <CIcon
              icon={icon}
              size="xl"
              className={`text-${color}`}
            />
          </div>
        </div>
      </CCardBody>
    </CCard>
  );

  return (
    <div className="container-fluid">

      {/* HEADER */}

      <CCard
        className="border-0 shadow-sm mb-4"
        style={{
          background:
            "linear-gradient(135deg,#0f2027,#203a43,#2c5364)",
          color: "#fff",
        }}
      >
        <CCardBody>

          <div className="d-flex justify-content-between align-items-center flex-wrap">

            <div>
              <h2 className="fw-bold">
                Dashboard Délibération
              </h2>

              <p className="mb-0">
                Suivi global des résultats académiques
              </p>
            </div>

            <div>
              <CButton
                color="light"
                className="me-2"
              >
                <CIcon icon={cilPrint} />
                {" "}PV
              </CButton>

              <CButton color="success">
                <CIcon icon={cilCloudDownload} />
                {" "}Excel
              </CButton>
            </div>

          </div>

        </CCardBody>
      </CCard>

      {/* KPIs */}

      <CRow className="g-4 mb-4">

        <CCol md={3}>
          <CardStat
            title="Étudiants Inscrits"
            value={stats.inscrits}
            color="primary"
            icon={cilPeople}
          />
        </CCol>

        <CCol md={3}>
          <CardStat
            title="Délibérés"
            value={stats.deliberes}
            color="success"
            icon={cilCheckCircle}
          />
        </CCol>

        <CCol md={3}>
          <CardStat
            title="Restants"
            value={stats.restants}
            color="warning"
            icon={cilWarning}
          />
        </CCol>

        <CCol md={3}>
          <CardStat
            title="Taux Réussite"
            value={`${stats.tauxReussite}%`}
            color="info"
            icon={cilChart}
          />
        </CCol>

      </CRow>

      {/* DECISIONS */}

      <CRow className="g-4 mb-4">

        <CCol md={4}>
          <CCard className="border-0 shadow-sm">
            <CCardBody className="text-center">
              <h5>Admis</h5>

              <h1 className="text-success fw-bold">
                {stats.admis}
              </h1>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol md={4}>
          <CCard className="border-0 shadow-sm">
            <CCardBody className="text-center">
              <h5>Ajournés</h5>

              <h1 className="text-danger fw-bold">
                {stats.ajournes}
              </h1>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol md={4}>
          <CCard className="border-0 shadow-sm">
            <CCardBody className="text-center">
              <h5>Session spéciale</h5>

              <h1 className="text-warning fw-bold">
                {stats.sessionSpeciale}
              </h1>
            </CCardBody>
          </CCard>
        </CCol>

      </CRow>

      {/* PROGRESSION */}

      <CCard className="border-0 shadow-sm mb-4">
        <CCardHeader>
          <strong>
            Progression de la délibération
          </strong>
        </CCardHeader>

        <CCardBody>

          <div className="mb-4">

            <div className="d-flex justify-content-between">
              <span>Délibérations effectuées</span>
              <strong>87%</strong>
            </div>

            <CProgress
              value={87}
              color="success"
            />

          </div>

          <div>

            <div className="d-flex justify-content-between">
              <span>PV générés</span>
              <strong>70%</strong>
            </div>

            <CProgress
              value={70}
              color="warning"
            />

          </div>

        </CCardBody>
      </CCard>

      {/* ETUDIANTS LIMITES */}

      <CCard className="border-0 shadow-sm mb-4">

        <CCardHeader>
          <strong>
            Étudiants à la limite (9.50 - 9.99)
          </strong>
        </CCardHeader>

        <CCardBody>

          <CTable hover responsive>

            <CTableHead>
              <CTableRow>

                <CTableHeaderCell>
                  Matricule
                </CTableHeaderCell>

                <CTableHeaderCell>
                  Nom
                </CTableHeaderCell>

                <CTableHeaderCell>
                  Moyenne
                </CTableHeaderCell>

              </CTableRow>
            </CTableHead>

            <CTableBody>

              {limites.map((item, index) => (
                <CTableRow key={index}>

                  <CTableDataCell>
                    {item.matricule}
                  </CTableDataCell>

                  <CTableDataCell>
                    {item.nom}
                  </CTableDataCell>

                  <CTableDataCell>

                    <CBadge color="warning">
                      {item.moyenne}
                    </CBadge>

                  </CTableDataCell>

                </CTableRow>
              ))}

            </CTableBody>

          </CTable>

        </CCardBody>

      </CCard>

      {/* ECUES */}

      <CCard className="border-0 shadow-sm">

        <CCardHeader>
          <strong>
            Performance des ECUE
          </strong>
        </CCardHeader>

        <CCardBody>

          <CTable hover responsive>

            <CTableHead>
              <CTableRow>

                <CTableHeaderCell>
                  ECUE
                </CTableHeaderCell>

                <CTableHeaderCell>
                  Moyenne
                </CTableHeaderCell>

                <CTableHeaderCell>
                  Taux réussite
                </CTableHeaderCell>

              </CTableRow>
            </CTableHead>

            <CTableBody>

              {ecues.map((e, index) => (

                <CTableRow key={index}>

                  <CTableDataCell>
                    {e.ecue}
                  </CTableDataCell>

                  <CTableDataCell>
                    {e.moyenne}/20
                  </CTableDataCell>

                  <CTableDataCell>

                    <CBadge
                      color={
                        e.taux >= 50
                          ? "success"
                          : "danger"
                      }
                    >
                      {e.taux}%
                    </CBadge>

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

export default DashboardDeliberation;