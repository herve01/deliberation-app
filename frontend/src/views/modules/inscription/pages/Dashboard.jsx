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
  CFormSelect,
  CInputGroup,
  CInputGroupText,
  CAlert,
    CDropdown,
    CDropdownToggle,
    CDropdownMenu,
    CDropdownItem,
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
import anneeService from "@src/infrastructure/services/inscription/anneeService";

const Dashboard = () => {

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [annees, setAnnees] = useState([]);

  const [dashboard, setDashboard] = useState({});

  // SAVE LOCAL STORAGE
  const [anneeId, setAnneeId] = useState(
    localStorage.getItem("dashboard_annee_id") || ""
  );

  const [stats, setStats] = useState({
    inscriptions: 0,
    inscriptionsToday: 0,
    inscriptionsMonth: 0,
    etudiants: 0,
    domaines: 0,
    filieres: 0,
    mentions: 0,
  });

  const [recentInscriptions, setRecentInscriptions] = useState([]);

  // LOAD ANNEES
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await anneeService.getAll();
        setAnnees(data || []);

        // AUTO SELECT
        if (!anneeId && data?.length > 0) {

          const defaultAnnee = data[0]?.id;
          setAnneeId(defaultAnnee);
          localStorage.setItem(
            "dashboard_annee_id",
            defaultAnnee
          );
        }
      } catch (e) {
        console.error(e);
        setError("Impossible de charger les années");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // CHANGE ANNEE
  const handleChange = () => (e) => {

    const value = e.target.value;

    setAnneeId(value);

    localStorage.setItem(
      "dashboard_annee_id",
      value
    );
  };

  // LOAD DASHBOARD
  useEffect(() => {
    if (!anneeId) return;

    async function loadDashboard() {
      try {
        setLoading(true);

        const [inscriptions, data] = await Promise.all([
          inscriptionService.getAllByTypeId(
            "ANNEE",
            anneeId
          ),

          inscriptionService.getInscriptionDashboard(
            anneeId
          ),
        ]);

        setDashboard(data || {});
        setRecentInscriptions(inscriptions || []);

        setStats({
          inscriptions: data?.totalInscription?.count || 0,
          inscriptionsToday: data?.toDay?.count || 0,
          inscriptionsMonth: data?.currentMonth?.count || 0,
          etudiants: data?.etudiants?.count || 0,
          domaines: data?.domaines?.count || 0,
          filieres: data?.filieres?.count || 0,
          mentions: data?.mentions?.count || 0,
        });

      } catch (e) {

        console.error(e);

        setError(
          "Impossible de charger le dashboard"
        );

      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, [anneeId]);

  // FORMAT DATE
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

  // STAT CARD
  const StatCard = ({
    title,
    value,
    color,
    icon,
    progress = 0,
  }) => (
    <CCard
      className="border-1 shadow-sm h-100"
      style={{
        borderRadius: 18,
      }}
    >
      <CCardBody>
        <div className="d-flex justify-content-between align-items-start mb-0">
          <div>
            <div
              className="text-medium-emphasis fw-semibold mb-1"
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
            {progress || 0}%
          </small>

        </div>

        <CProgress
          thin
          color={color}
          value={progress || 0}
        />

      </CCardBody>

    </CCard>

  );

  // LOADING
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

      {/* ERROR */}
      {error && (
        <CAlert color="danger">
          {error}
        </CAlert>
      )}

      {/* HEADER */}
      <div
        className="mb-3 p-3 shadow-sm"
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
              Tableau de bord
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
          style={{
            position: "relative",
          }}>
          <CDropdown alignment="end">
            <CDropdownToggle
              color="light"
              className="border-0 shadow-sm d-flex align-items-center gap-2 px-4 py-2"
              style={{
                borderRadius: 16,
                background: "rgba(255,255,255,0.15)",
                color: "#fff",
                backdropFilter: "blur(8px)",
              }}>

              <CIcon icon={cilCalendar} />
              <div className="text-start">
                <div
                  className="small"
                  style={{opacity: 0.8,}}>
                  Année académique
                </div>
                <div className="fw-bold">
                  {
                    annees.find(
                      (a) => a.id == anneeId
                    )?.annee || "Sélectionner"
                  }
                </div>
              </div>

            </CDropdownToggle>

            <CDropdownMenu
              className="border-0 shadow-lg mt-2"
              style={{
                borderRadius: 16,
                minWidth: 230,
              }}
            >
              {annees?.map((annee) => (

                <CDropdownItem
                  key={annee.id}
                  active={annee.id == anneeId}
                  className="py-2 px-3"
                  onClick={() => {
                    setAnneeId(annee.id);
                    localStorage.setItem(
                      "dashboard_annee_id",
                      annee.id
                    );
                  }}
                >

                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-semibold">
                      {annee.annee}
                    </span>
                    {annee.id == anneeId && (
                      <CBadge
                        color="primary"
                        shape="rounded-pill"
                      >
                        Active
                      </CBadge>
                    )}
                  </div>

                </CDropdownItem>

              ))}

            </CDropdownMenu>
          </CDropdown>

        </div>

        </div>

      </div>

      {/* STATS */}
      <CRow className="g-4 mb-4">

        <CCol xs={12} sm={6} xl={3}>
          <StatCard
            title="Total inscriptions"
            value={stats.inscriptions}
            color="primary"
            icon={cilSchool}
            progress={
              dashboard.totalInscription?.progression || 0
            }
          />
        </CCol>

        <CCol xs={12} sm={6} xl={3}>
          <StatCard
            title="Aujourd’hui"
            value={stats.inscriptionsToday}
            color="success"
            icon={cilCalendar}
            progress={
              dashboard.toDay?.progression || 0
            }
          />
        </CCol>

        <CCol xs={12} sm={6} xl={3}>
          <StatCard
            title="Ce mois"
            value={stats.inscriptionsMonth}
            color="warning"
            icon={cilCalendarCheck}
            progress={
              dashboard.currentMonth?.progression || 0
            }
          />
        </CCol>

        <CCol xs={12} sm={6} xl={3}>
          <StatCard
            title="Étudiants"
            value={stats.etudiants}
            color="info"
            icon={cilPeople}
            progress={
              dashboard.etudiants?.progression || 0
            }
          />
        </CCol>

      </CRow>

      {/* STRUCTURE */}
      <CRow className="g-4 mb-4">

        <CCol xs={12} sm={6} xl={4}>
          <StatCard
            title="Domaines"
            value={stats.domaines}
            color="primary"
            icon={cilLibrary}
            progress={
              dashboard.domaines?.progression || 0
            }
          />
        </CCol>

        <CCol xs={12} sm={6} xl={4}>
          <StatCard
            title="Filières"
            value={stats.filieres}
            color="success"
            icon={cilLayers}
            progress={
              dashboard.filieres?.progression || 0
            }
          />
        </CCol>

        <CCol xs={12} sm={6} xl={4}>
          <StatCard
            title="Mentions"
            value={stats.mentions}
            color="warning"
            icon={cilEducation}
            progress={
              dashboard.mentions?.progression || 0
            }
          />
        </CCol>

      </CRow>

      {/* TABLE */}
      <CCard className="border-1 shadow-sm">

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

            <CTableHead
              color="light"
              className="border-1"
            >

              <CTableRow>

                <CTableHeaderCell>
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

                  <CTableRow
                    key={i.id}
                    className="border-1"
                  >

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