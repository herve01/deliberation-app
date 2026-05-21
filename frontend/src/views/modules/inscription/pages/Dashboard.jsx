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
  CImage,
  CProgress,
} from "@coreui/react";

import {
  cilPeople,
  cilCalendar,
  cilCalendarCheck,
  cilSchool,
  cilLibrary,
  cilLayers,
  cilEducation,
} from "@coreui/icons";

import CIcon from "@coreui/icons-react";

import inscriptionService from "@src/infrastructure/services/inscription/inscriptionService";
import etudiantService from "@src/infrastructure/services/inscription/etudiantService";

import domaineService from "@src/infrastructure/services/inscription/domaineService";
import filiereService from "@src/infrastructure/services/inscription/filiereService";
import mentionService from "@src/infrastructure/services/inscription/mentionService";

const Dashboard = () => {

  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    inscriptions: 0,
    inscriptionsToday: 0,
    inscriptionsMonth: 0,
    inscriptionsYear: 0,
    etudiants: 0,

    domaines: 0,
    filieres: 0,
    mentions: 0,
  });

  const [recentInscriptions, setRecentInscriptions] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {

    try {

      setLoading(true);

      const [
        inscriptions,
        etudiants,
        domaines,
        filieres,
        mentions,
      ] = await Promise.all([
        inscriptionService.getAll(),
        etudiantService.getAll(),
        domaineService.getAll(),
        filiereService.getAll(),
        mentionService.getAll(),
      ]);

      const now = new Date();

      const currentDay = now.toDateString();

      const currentMonth = now.getMonth();

      const currentYear = now.getFullYear();

      const inscriptionsToday = inscriptions.filter((i) => {

        if (!i.createdAt) return false;

        return (
          new Date(i.createdAt).toDateString() === currentDay
        );

      }).length;

      const inscriptionsMonth = inscriptions.filter((i) => {

        if (!i.createdAt) return false;

        const d = new Date(i.createdAt);

        return (
          d.getMonth() === currentMonth &&
          d.getFullYear() === currentYear
        );

      }).length;

      const inscriptionsYear = inscriptions.filter((i) => {

        if (!i.createdAt) return false;

        return (
          new Date(i.createdAt).getFullYear() === currentYear
        );

      }).length;

      setStats({
        inscriptions: inscriptions.length,
        inscriptionsToday,
        inscriptionsMonth,
        inscriptionsYear,
        etudiants: etudiants.length,

        domaines: domaines.length,
        filieres: filieres.length,
        mentions: mentions.length,
      });

      const sorted = [...inscriptions].sort(
        (a, b) =>
          new Date(b.createdAt || 0) -
          new Date(a.createdAt || 0)
      );

      setRecentInscriptions(sorted.slice(0, 5));

    } catch (error) {

      console.error(
        "Erreur lors du chargement du dashboard :",
        error
      );

    } finally {

      setLoading(false);

    }

  };

  const formatDate = (date) => {

    if (!date) return "-";

    return new Date(date).toLocaleDateString(
      "fr-FR",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }
    );

  };

  const StatCard = ({
    title,
    value,
    color,
    icon,
    progress = 75,
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
              size="xl"
              className={`text-${color}`}
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
              Tableau de bord académique
            </h2>

            <div
              style={{
                opacity: 0.9,
              }}
            >
              Gestion des inscriptions universitaires
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

      {/* STATISTIQUES */}

      <CRow className="g-4 mb-4">

        <CCol xs={12} sm={6} xl={3}>
          <StatCard
            title="Total inscriptions"
            value={stats.inscriptions}
            color="primary"
            icon={cilSchool}
            progress={92}
          />
        </CCol>

        <CCol xs={12} sm={6} xl={3}>
          <StatCard
            title="Aujourd’hui"
            value={stats.inscriptionsToday}
            color="success"
            icon={cilCalendar}
            progress={68}
          />
        </CCol>

        <CCol xs={12} sm={6} xl={3}>
          <StatCard
            title="Ce mois"
            value={stats.inscriptionsMonth}
            color="warning"
            icon={cilCalendarCheck}
            progress={84}
          />
        </CCol>

        <CCol xs={12} sm={6} xl={3}>
          <StatCard
            title="Étudiants"
            value={stats.etudiants}
            color="info"
            icon={cilPeople}
            progress={95}
          />
        </CCol>

      </CRow>

      {/* STRUCTURE ACADEMIQUE */}

      <CRow className="g-4 mb-4">

        <CCol xs={12} sm={6} xl={4}>
          <StatCard
            title="Domaines"
            value={stats.domaines}
            color="primary"
            icon={cilLibrary}
            progress={90}
          />
        </CCol>

        <CCol xs={12} sm={6} xl={4}>
          <StatCard
            title="Filières"
            value={stats.filieres}
            color="success"
            icon={cilLayers}
            progress={75}
          />
        </CCol>

        <CCol xs={12} sm={6} xl={4}>
          <StatCard
            title="Mentions"
            value={stats.mentions}
            color="warning"
            icon={cilEducation}
            progress={82}
          />
        </CCol>

      </CRow>

      {/* TABLE INSCRIPTIONS */}

      <CCard
        className="border-1 shadow-sm"

      >

        <CCardHeader className="bg-light border-1 py-2 d-flex justify-content-between align-items-center">

          <div>

            <h5 className="mb-1 fw-bold">
              Inscriptions récentes
            </h5>

            <small className="text-medium-emphasis">
              Les dernières inscriptions académiques
            </small>

          </div>

          <CBadge
            color="primary"
            shape="rounded-pill"
            className="px-3 py-2"
          >
            {recentInscriptions.length}
          </CBadge>

        </CCardHeader>

        <CCardBody>

          <CTable
            hover
            responsive
            align="middle"
            className="mb-0"
          >

            <CTableHead color="light" className="border-1">

              <CTableRow>

                <CTableHeaderCell >
                  Étudiant
                </CTableHeaderCell>

                <CTableHeaderCell>
                  Mention
                </CTableHeaderCell>

                <CTableHeaderCell>
                  Date
                </CTableHeaderCell>

              </CTableRow>

            </CTableHead>

            <CTableBody>

              {recentInscriptions.length > 0 ? (

                recentInscriptions.map((i) => (

                  <CTableRow key={i.id} className="border-1">

                    <CTableDataCell className="border-0 py-1">

                      <div className="d-flex align-items-center gap-3">

                        {i.photo ? (

                          <CImage
                            className="rounded-circle object-fit-cover"
                            src={
                              i.photo.startsWith("data:")
                                ? i.photo
                                : `data:image/jpeg;base64,${i.photo}`
                            }
                            width={45}
                            height={45}
                            rounded
                            style={{
                              objectFit: "cover",
                              border: "2px solid #eee",
                            }}
                          />

                        ) : (

                          <div
                            className="d-flex align-items-center justify-content-center rounded-circle fw-bold text-white"
                            style={{
                              width: 45,
                              height: 45,
                              background:
                                "linear-gradient(135deg,#4e73df,#224abe)",
                              fontSize: 13,
                            }}
                          >
                            {`${i.etudiant?.prenom?.charAt(0) || ""
                              }${i.etudiant?.nom?.charAt(0) || ""
                              }`}
                          </div>

                        )}

                        <div>

                          <div className="fw-semibold">

                            {i.etudiant?.nom || "-"}{" "}
                            {i.etudiant?.postnom || "-"}{" "}
                            {i.etudiant?.prenom || "-"}

                          </div>

                          <small className="text-medium-emphasis">
                            {i.etudiant?.telephone || "-"}
                          </small>

                        </div>

                      </div>

                    </CTableDataCell>

                    <CTableDataCell className="border-0">

                      <CBadge
                        color="info"
                        shape="rounded-pill"
                        className="px-3 py-2"
                      >

                        {i.mention?.niveau?.intitule || "-"}{" "}
                        {i.mention?.intitule || "-"}

                      </CBadge>

                    </CTableDataCell>

                    <CTableDataCell className="border-0">

                      <div className="fw-semibold">
                        {formatDate(i.createdAt)}
                      </div>

                    </CTableDataCell>

                  </CTableRow>

                ))

              ) : (

                <CTableRow>

                  <CTableDataCell
                    colSpan={3}
                    className="text-center py-5 text-medium-emphasis border-0"
                  >
                    Aucune inscription trouvée
                  </CTableDataCell>

                </CTableRow>

              )}

            </CTableBody>

          </CTable>

        </CCardBody>

      </CCard>

    </div>

  );

};

export default Dashboard;