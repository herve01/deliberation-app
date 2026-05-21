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
} from "@coreui/react";

import {
  cilPeople,
  cilCalendar,
  cilCalendarCheck,
  cilSchool,
  cilUser,
  cilUserFemale
} from "@coreui/icons";

import CIcon from "@coreui/icons-react";

import inscriptionService from "@src/infrastructure/services/inscription/inscriptionService";
import etudiantService from "@src/infrastructure/services/inscription/etudiantService";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    inscriptions: 0,
    inscriptionsToday: 0,
    inscriptionsMonth: 0,
    inscriptionsYear: 0,
    etudiants: 0,
  });

  const [recentInscriptions, setRecentInscriptions] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const [inscriptions, etudiants] = await Promise.all([
        inscriptionService.getAll(),
        etudiantService.getAll(),
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
  }) => (
    <CCard
      className="border-1 shadow-sm h-100"
      style={{
        borderRadius: "14px",
      }}
    >
      <CCardBody className="d-flex justify-content-between align-items-center">
        <div>
          <div className="text-medium-emphasis small mb-1">
            {title}
          </div>

          <h3 className="fw-bold mb-0">
            {value}
          </h3>
        </div>

        <div
          className={`bg-${color} bg-opacity-10 d-flex align-items-center justify-content-center`}
          style={{
            width: 55,
            height: 55,
            borderRadius: "12px",
          }}
        >
          <CIcon
            icon={icon}
            size="xl"
            className={`text-${color}`}
          />
        </div>
      </CCardBody>
    </CCard>
  );

  if (loading) {
    return (
      <div className="text-center py-5">
        <CSpinner color="primary" />
      </div>
    );
  }

  return (
    <div className="container-fluid">

      {/* HEADER */}
      <div className="mb-4">
        <h3 className="fw-bold mb-1">
          Tableau de bord
        </h3>

        <div className="text-medium-emphasis">
          Gestion des inscriptions académiques
        </div>
      </div>

      {/* STATS */}
      <CRow className="g-3 mb-4">

        <CCol xs={12} sm={6} xl={3}>
          <StatCard
            title="Total inscriptions"
            value={stats.inscriptions}
            color="primary"
            icon={cilSchool}
          />
        </CCol>

        <CCol xs={12} sm={6} xl={3}>
          <StatCard
            title="Aujourd’hui"
            value={stats.inscriptionsToday}
            color="success"
            icon={cilCalendar}
          />
        </CCol>

        <CCol xs={12} sm={6} xl={3}>
          <StatCard
            title="Ce mois"
            value={stats.inscriptionsMonth}
            color="warning"
            icon={cilCalendarCheck}
          />
        </CCol>

        <CCol xs={12} sm={6} xl={3}>
          <StatCard
            title="Cette année"
            value={stats.inscriptionsYear}
            color="danger"
            icon={cilCalendar}
          />
        </CCol>

      </CRow>

      {/* ETUDIANTS */}
      <CRow className="g-3 mb-4">

        <CCol xs={12}>
          <CCard
            className="border-0 shadow-sm"
            style={{
              borderRadius: "14px",
            }}
          >
            <CCardBody className="d-flex justify-content-between align-items-center">
              <div>
                <div className="text-medium-emphasis small mb-1">
                  Étudiants
                </div>

                <h3 className="fw-bold mb-0">
                  {stats.etudiants}
                </h3>
              </div>

              <CIcon
                icon={cilPeople}
                size="xxl"
                className="text-info"
              />
            </CCardBody>
          </CCard>
        </CCol>

      </CRow>

      {/* TABLE INSCRIPTIONS */}
      <CCard
        className="border-0 shadow-sm"
        style={{
          borderRadius: "14px",
        }}
      >
        <CCardHeader className="bg-white border-0 py-3 d-flex justify-content-between align-items-center">
          <div>
            <h5 className="mb-0 fw-bold">
              Inscriptions récentes
            </h5>

            <small className="text-medium-emphasis">
              Les 5 dernières inscriptions
            </small>
          </div>

          <CBadge color="primary">
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
           <CTableHead color="light">
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
                 <CTableRow key={i.id}>

                   <CTableDataCell>
                     <div className="d-flex align-items-center gap-3">

                       {i.photo ? (
                         <CImage
                         className="rounded-circle object-fit-cover"
                           src={
                             i.photo.startsWith("data:")
                               ? i.photo
                               : `data:image/jpeg;base64,${i.photo}`
                           }
                           width={50}
                           height={50}
                           rounded
                           style={{
                             objectFit: "cover",
                             border: "1px solid #ddd",
                           }}
                         />
                       ) : (
                         <div
                           className="bg-light d-flex align-items-center justify-content-center rounded-circle object-fit-cover fw-bold text-uppercase"
                           style={{
                             width: 50,
                             height: 50,
                             fontSize: 14,
                             color: "#555",
                           }}
                         >
                            {`${i.etudiant?.prenom?.charAt(0) || ""}${i.etudiant?.nom?.charAt(0) || ""}`}
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

                   <CTableDataCell>
                     <CBadge color="info">
                       {i.mention?.niveau?.intitule || "-"}{" "}
                       {i.mention?.intitule || "-"}
                     </CBadge>
                   </CTableDataCell>

                   <CTableDataCell>
                     {formatDate(i.createdAt)}
                   </CTableDataCell>

                 </CTableRow>
               ))
             ) : (
               <CTableRow>
                 <CTableDataCell
                   colSpan={3}
                   className="text-center py-4 text-medium-emphasis"
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