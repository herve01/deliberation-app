import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

import {
  CCard,
  CRow,
  CCol,
  CCardBody,
  CCardHeader,
  CSpinner,
  CAlert,
  CBadge,
  CFormSelect,
  CInputGroup,
  CInputGroupText,
  CFormInput,
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CButton
} from "@coreui/react";

import {
  cilCalendar,
  cilLibrary,
  cilEducation,
  cilSearch,
  cilClock,
  cilBookmark,
  cilCheckCircle
} from "@coreui/icons";

import CIcon from "@coreui/icons-react";

import domaineService from "@src/infrastructure/services/inscription/domaineService";
import filiereService from "@src/infrastructure/services/inscription/filiereService";
import mentionService from "@src/infrastructure/services/inscription/mentionService";
import anneeService from "@src/infrastructure/services/inscription/anneeService";
import sessionService from "@src/infrastructure/services/cotation/sessionService";

import deliberationService from "@src/infrastructure/services/deliberation/deliberationService";
import deliberationDetailService from "@src/infrastructure/services/deliberation/deliberationDetailService";

import { useToast } from "@src/app/context/ToastContext";

const STORAGE = {
  anneeId: "anneeIdStored",
  domaineId: "domaineIdStored",
  filiereId: "filiereIdStored",
  mentionId: "mentionIdStored",
  sessionId: "sessionIdStored",
};

export default function DeliberationMention() {

  const { showToast } = useToast();
  const location = useLocation();
  // ================= STATE =================

  const [data, setData] = useState({ details: [] });
  const [deliberations, setDeliberations] = useState([]);
  const details = deliberations?.[0]?.mentionSemestreEcueDetails ?? [];

  const [domaines, setDomaines] = useState([]);
  const [filieres, setFilieres] = useState([]);
  const [mentions, setMentions] = useState([]);
  const [annees, setAnnees] = useState([]);
  const [sessions, setSessions] = useState([]);

  const [selectedSession, setSelectedSession] = useState(null);
  const [selectedMention, setSelectedMention] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [incrementor, setIncrementor] = useState(0);

  const [param, setParam] = useState({
    anneeId: localStorage.getItem(STORAGE.anneeId) || "",
    domaineId: localStorage.getItem(STORAGE.domaineId) || "",
    filiereId: localStorage.getItem(STORAGE.filiereId) || "",
    mentionId: localStorage.getItem(STORAGE.mentionId) || "",
    sessionId: localStorage.getItem(STORAGE.sessionId) || "",
  });

  // ================= LOCAL STORAGE =================

  useEffect(() => {

    localStorage.setItem(STORAGE.anneeId, param.anneeId || "");
    localStorage.setItem(STORAGE.domaineId, param.domaineId || "");
    localStorage.setItem(STORAGE.filiereId, param.filiereId || "");
    localStorage.setItem(STORAGE.mentionId, param.mentionId || "");
    localStorage.setItem(STORAGE.sessionId, param.sessionId || "");

  }, [param]);

  // ================= INIT =================

  useEffect(() => {

    async function load() {

      try {
        setLoading(true);
        const [d, a] = await Promise.all([
          domaineService.getAll(),
          anneeService.getAll(),
        ]);

        setDomaines(d || []);
        setAnnees(a || []);

      } catch {
        setError("Erreur chargement données");
      } finally {
        setLoading(false);
      }
    }

    load();

  }, [location.state]);

  // ================= FILIERES =================

  useEffect(() => {
    if (!param.domaineId) {
      setFilieres([]);
      return;
    }

    filiereService
      .getAllByDomaine(param.domaineId)
      .then(setFilieres)
      .catch(() => setFilieres([]));

  }, [param.domaineId]);

  // ================= MENTIONS =================

  useEffect(() => {
    if (!param.filiereId) {
      setMentions([]);
      return;
    }
    mentionService
      .getAllByFiliere(param.filiereId)
      .then(setMentions)
      .catch(() => setMentions([]));

  }, [param.filiereId]);

  // ================= SELECT MENTION =================

  useEffect(() => {
    const found = mentions.find(
      (m) => String(m.id) === String(param.mentionId)
    );

    if (found) {
      setSelectedMention(found);
      setIncrementor(found.numeroSemestreIncementor || 0);
    } else {
      setSelectedMention(null);
      setIncrementor(0);
    }

  }, [mentions, param.mentionId]);

  // ================= SESSIONS =================

  useEffect(() => {
    if (incrementor < 0) {
      setSessions([]);
      return;
    }
    sessionService
      .getAllByWithoutMentionIncrementor(incrementor)
      .then(setSessions)
      .catch(() => setSessions([]));

  }, [incrementor]);

  // ================= SELECT SESSION =================

  useEffect(() => {
    const found = sessions.find(
      (s) => String(s.id) === String(param.sessionId));

    if (found) {
      setSelectedSession(found);
    } else {
      setSelectedSession(null);
    }

  }, [sessions, param.sessionId]);

  // ================= LOAD DELIBERATION =================

  useEffect(() => {

    const loadDeliberation = async () => {

      if (!param?.anneeId || !selectedMention?.id || !selectedSession?.id) {

        setDeliberations([]);
        return;
      }

      try {
        setLoading(true);
        const data = await deliberationDetailService.getAllByAnneeMentionSesmestreSessionWith(
              param.anneeId, selectedMention.id,selectedSession.semestre?.id, selectedSession.id);

        setDeliberations(data || []);

      } catch (error) {
        console.error(
          "Erreur lors du chargement de la délibération :", error);

        setDeliberations([]);
      } finally {
        setLoading(false);
      }
    };

    loadDeliberation();
  }, [param.anneeId, selectedMention?.id, selectedSession?.id]);

  // ================= HELPERS =================

  const normalize = (t) =>
    String(t || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  const filteredData = useMemo(() => {

    const s = normalize(search);

    return deliberations.filter((d) =>
      normalize(
        `${d.inscription?.etudiant?.nom}
         ${d.inscription?.etudiant?.postnom}
         ${d.inscription?.etudiant?.prenom}`
      ).includes(s)
    );

  }, [search, deliberations]);

  // ================= ACTIONS =================

  const handleChange = (f) => (e) => {
    const v = e.target.value;
    setParam((p) => ({
      ...p,
      [f]: v,

      ...(f === "domaineId" && {
        filiereId: "",
        mentionId: "",
        sessionId: "",
      }),

      ...(f === "filiereId" && {
        mentionId: "",
        sessionId: "",
      }),

      ...(f === "mentionId" && {
        sessionId: "",
      }),
    }));
  };


    const handleSave = async () => {
      if (loading) return;

      try {
        setLoading(true);

        console.log(param?.mentionId);

        const delibId = deliberations[0]?.deliberation?.deliberation?.id;

         console.log('delibId', delibId);
         console.log('deliberations', deliberations[0]?.deliberation);


        const payload = {
          deliberation: {
            id: delibId ?? "",
            mentionId: param?.mentionId ?? "",
            semestreId: selectedSession?.semestre?.id ?? "",
            anneeId: param?.anneeId ?? "",
            sessionId: selectedSession?.id ?? "",
          },
          details: [],
        };

        deliberations.forEach((item) => {
          const d = item?.deliberation;

          console.log('d', d);

          payload.details.push({
            id: item?.id ?? d?.id ?? "",
            deliberationId: d?.deliberation?.id ?? "",
            inscriptionId: item?.inscription?.id ?? "",
            credits: d?.credits ?? 0,
            valides: d?.valides ?? 0,
            transferes: d?.transferes ?? 0,
            moyenne: d?.moyenne ?? 0,
            total: d?.total ?? 0,
            aEchoue: d?.aEchoue,
            decision: d?.decision,
          });
        });

        setData(payload);

        await deliberationService.addWithDetails(payload);

        showToast(
          `La délibération de la mention "${selectedMention?.mentionName ?? ""}" a été enregistrée avec succès !`
        );
      } catch (error) {
        console.error("Erreur lors de l'enregistrement de la délibération :", error);

        showToast(
          "Erreur lors de l'enregistrement de la délibération.",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

  // ================= RENDER =================

  return (

    <div className="container-fluid px-0 px-md-0">
      <CCard className="shadow-sm"
      >
        {/* HEADER */}
        <CCardHeader className="bg-light py-3 px-4">
          <div className="d-flex flex-column flex-md-row justify-content-between gap-2">
            <div>
              <h4 className="fw-bold mb-1">
                Liste des étudiants délibérés
              </h4>

              <div className="text-medium-emphasis">
                Gestion académique des délibérations
              </div>
            </div>
            <div className="d-flex justify-content-between align-items-center gap-3">
              <small className="mb-0">{selectedMention?.mentionName}</small>

              <CButton
               color="primary"
               onClick={handleSave}
              >
                <CIcon icon={cilCheckCircle} className="me-2" />
                Clôturer la délibération
              </CButton>
            </div>
          </div>
        </CCardHeader>

        <CCardBody>
          {/* FILTERS */}
          <CRow className="bg-light border rounded p-2 mb-2 g-2">
            {[
              {
                label: "Session",
                icon: cilClock,
                value: param.sessionId,
                onChange: handleChange("sessionId"),
                options: sessions,
                getLabel: (s) =>`${s.semestre?.semestreName} => ${s.sessionName}`,
                getValue: (s) => s.id,
              },
              {
                label: "Année",
                icon: cilCalendar,
                value: param.anneeId,
                onChange: handleChange("anneeId"),
                options: annees,
                getLabel: (a) => a.annee,
                getValue: (a) => a.id,
              },
              {
                label: "Domaine",
                icon: cilLibrary,
                value: param.domaineId,
                onChange: handleChange("domaineId"),
                options: domaines,
                getLabel: (d) => d.intitule,
                getValue: (d) => d.id,
              },
              {
                label: "Filière",
                icon: cilEducation,
                value: param.filiereId,
                onChange: handleChange("filiereId"),
                options: filieres,
                getLabel: (f) => f.intitule,
                getValue: (f) => f.id,
              },
              {
                label: "Mention",
                icon: cilBookmark,
                value: param.mentionId,
                onChange: handleChange("mentionId"),
                options: mentions,
                getLabel: (m) => m.mentionName,
                getValue: (m) => m.id,
              },
            ].map((field) => (
              <CCol key={field.label} xs={12} md={3} className="px-2">
                <CInputGroup>
                  <CInputGroupText>
                    <CIcon icon={field.icon} />
                  </CInputGroupText>

                  <CFormSelect
                    value={field.value}
                    onChange={field.onChange}>

                    <option value="">
                      {field.label}
                    </option>

                    {field.options?.map((opt) => (
                      <option
                        key={field.getValue(opt)}
                        value={field.getValue(opt)}>
                        {field.getLabel(opt)}
                      </option>
                    ))}
                  </CFormSelect>
                </CInputGroup>
              </CCol>
            ))}
          </CRow>

          {/* SEARCH */}
          <div className="d-flex justify-content-between mb-3">
            <div className="mt-3">
              {filteredData.length} élément(s)
            </div>

            <CInputGroup
              className="w-100 w-md-auto"
              style={{ maxWidth: "40%" }}>

              <CInputGroupText>
                <CIcon icon={cilSearch} />
              </CInputGroupText>

              <CFormInput
                placeholder="Rechercher..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </CInputGroup>
          </div>

          {/* TABLE */}
          {loading ? (
            <div className="text-center py-3">
              <CSpinner color="primary" />
            </div>

          ) : error ? (
            <CAlert color="danger">
              {error}
            </CAlert>
          ) : filteredData.length === 0 ? (
            <CAlert color="warning">
              Aucune cotation inscrits pour cette mention
            </CAlert>
          ) : (

            <div
              className="table-responsive"
              style={{
                width: "100%",
                maxHeight: "75vh",
                overflowY: "auto",
                overflowX: "auto",
              }}
            >
              <CTable
                   bordered
                   hover
                   className="align-middle mb-0 border text-center"
                   style={{
                     width: "100%",
                     tableLayout: "fixed",
                     fontSize: "12px",
                   }}
                >

                <CTableHead className="table-light">

                  <CTableRow>
                    <CTableHeaderCell rowSpan={3}
                         style={{ width: "12%" }}
                         className="text-start"
                    >
                      Étudiant
                    </CTableHeaderCell>
                    {
                      details.map((row, index) => (

                      <CTableHeaderCell
                        key={index}
                        colSpan={3}
                       style={{
                         padding: 0,
                         overflow: "hidden",
                         verticalAlign: "bottom",
                       }}
                      >
                   <div
                style={{
                  writingMode: "vertical-rl",
                  transform: "rotate(180deg)",
                  textAlign: "center",
                  whiteSpace: "normal",
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                  margin: "auto",
                  padding: "5px 2px",
                  lineHeight: "1.1",
                  maxHeight: "200px",
                }}
                   >
                     <strong>{row.ecue.intitule}</strong>
                   </div>
                      </CTableHeaderCell>
                    ))}

                    <CTableHeaderCell style={{ width: "5%" }} rowSpan={3}>
                      Crédits
                    </CTableHeaderCell>

                    <CTableHeaderCell style={{ width: "3.8%" }} rowSpan={3}>
                      Moy
                    </CTableHeaderCell>

                    <CTableHeaderCell style={{ width: "6.5%" }} rowSpan={3}>
                      Décision
                    </CTableHeaderCell>
                  </CTableRow>

                  <CTableRow>
                    {details.map((row, index) => (

                      <CTableHeaderCell
                        key={index}
                        colSpan={3}>
                        {row.categorie.intitule}
                        {" | "}
                        Crédit : {row.credit}
                      </CTableHeaderCell>
                    ))}
                  </CTableRow>

                  <CTableRow style={{fontSize: "10px",}}>
                    {details.map((_, index) =>(
                      <React.Fragment key={index}>
                        <CTableHeaderCell>
                          CC
                        </CTableHeaderCell>

                        <CTableHeaderCell>
                          EXA
                        </CTableHeaderCell>

                        <CTableHeaderCell>
                          N.FIN
                        </CTableHeaderCell>
                      </React.Fragment>
                    ))}
                  </CTableRow>
                </CTableHead>

                <CTableBody>
                  {filteredData.map((row, index) => (
                    <CTableRow key={index}>

                      <CTableDataCell className="text-start">
                        {row.inscription?.etudiant?.nom}
                        {" "}
                        {row.inscription?.etudiant?.postnom}
                        {" "}
                        {row.inscription?.etudiant?.prenom}
                      </CTableDataCell>

                        {details.map((item) => {
                          const examensMap = Object.fromEntries(
                            (row.examens || []).map((e) => [
                              e.mentionSemestreEcue.id,e,])
                          );

                          const annuelsMap = Object.fromEntries(
                            (row.annuels || []).map((a) => [
                              a.mentionSemestreEcue.id,a,])
                          );

                          const totalsMap = Object.fromEntries(
                            (row.totals || []).map((t) => [
                              t.mentionSemestreEcue.id,t,])
                          );

                          return (
                            <React.Fragment key={item.id}>
                              <CTableDataCell>
                                {annuelsMap[item.id]?.note?.toFixed(1) ?? 0}
                              </CTableDataCell>

                              <CTableDataCell>
                                {examensMap[item.id]?.note?.toFixed(1) ?? 0}
                              </CTableDataCell>

                              <CTableDataCell>
                                {totalsMap[item.id]?.note?.toFixed(1) ?? 0}
                              </CTableDataCell>
                            </React.Fragment>
                          );
                        })}

                      <CTableDataCell>
                        <strong>
                          {row?.deliberation?.credits}
                        </strong>
                      </CTableDataCell>

                      <CTableDataCell>
                        <strong>
                          {row?.deliberation?.moyenne?.toFixed(1)}
                        </strong>
                      </CTableDataCell>

                      <CTableDataCell>
                        <CBadge
                          color={
                            !row?.deliberation?.aEchoue
                              ? "success"
                              : "danger"
                          }>
                          {row?.deliberation?.decision}
                        </CBadge>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </div>
          )}
        </CCardBody>
      </CCard>
    </div>
  );
}