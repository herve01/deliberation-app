import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

import {
  CCard, CRow, CCol, CCardBody, CCardHeader,
  CButton, CSpinner, CAlert, CBadge,
  CFormSelect, CInputGroup, CInputGroupText,
  CListGroup, CListGroupItem, CFormInput,
  CTable, CTableHead, CTableBody, CTableRow,
  CTableHeaderCell, CTableDataCell
} from "@coreui/react";

import {
  cilPencil,
  cilCalendar,
  cilLibrary,
  cilEducation,
  cilSearch
} from "@coreui/icons";

import CIcon from "@coreui/icons-react";

import inscriptionService from "@src/infrastructure/services/inscription/inscriptionService";
import domaineService from "@src/infrastructure/services/inscription/domaineService";
import filiereService from "@src/infrastructure/services/inscription/filiereService";
import mentionService from "@src/infrastructure/services/inscription/mentionService";
import anneeService from "@src/infrastructure/services/inscription/anneeService";

import sessionService from "@src/infrastructure/services/cotation/sessionService";
import cotationService from "@src/infrastructure/services/cotation/cotationService";
import cotationDetailService from "@src/infrastructure/services/cotation/cotationDetailService";

import CotationEtudiantsModal from "@src/views/modules/cotation/pages/modal/CotationEtudiantsModal";

const STORAGE = {
  anneeId: "anneeIdStored",
  domaineId: "domaineIdStored",
  filiereId: "filiereIdStored",
  mentionId: "mentionIdStored",
  session: "sessionStored",
};

export default function CotationList() {

  const location = useLocation();

  // ================= STATE =================
  const [cotations,setCotations] = useState([]);
    const [inscriptions,setInscriptions] = useState([]);

    const [domaines,setDomaines] = useState([]);
    const [filieres,setFilieres] = useState([]);
    const [mentions,setMentions] = useState([]);
    const [annees,setAnnees] = useState([]);
    const [sessions,setSessions] = useState([]);

    const [cotation,setCotation] = useState({});
    const [selectedRow,setSelectedRow] = useState(null);

    const [selectedMention,setSelectedMention] = useState(null);
    const [selectedSession,setSelectedSession] = useState(JSON.parse(localStorage.getItem(STORAGE.session) || "null"));

    const [loading,setLoading] = useState(true);
    const [error,setError] = useState("");

    const [search,setSearch] = useState("");
    const [visible,setVisible] = useState(false);

    const [incrementor,setIncrementor] = useState(0);

    const [param, setParam] = useState({
        anneeId: localStorage.getItem(STORAGE.anneeId) || "",
        domaineId: localStorage.getItem(STORAGE.domaineId) || "",
        filiereId: localStorage.getItem(STORAGE.filiereId) || "",
        mentionId: localStorage.getItem(STORAGE.mentionId) || ""
    });

  // ================= LOCAL STORAGE =================
  useEffect(() => {
    localStorage.setItem(STORAGE.anneeId, param.anneeId || "");
    localStorage.setItem(STORAGE.domaineId, param.domaineId || "");
    localStorage.setItem(STORAGE.filiereId, param.filiereId || "");
    localStorage.setItem(STORAGE.mentionId, param.mentionId || "");
    localStorage.setItem(STORAGE.session,
      selectedSession ? JSON.stringify(selectedSession) : ""
    );
  }, [param, selectedSession]);

  const handleModalSubmit = (data) => {

    setCotations((prev) =>
          prev.map((item) =>
             item?.mentionSemestreEcueDetail.id === data.mentionSemestreEcueId
                ? {
                    ...item,
                    estCote: data.estCote,
                    countWithCote: data.countWithCote,
                    countManqueCote: data.countManqueCote,
                  }
                : item
          )
       );
  };


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
        setError("Erreur chargement données <<domaines et année academqiue>>");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [location.state]);

  useEffect(() => {
    const loadCotation = async () => {
        if (!selectedSession?.id || !selectedSession?.semestre?.id || !selectedRow?.id) {
            setCotation({});
            return;
        }

        try {
            const data = await cotationService.getByMentionSemestreAnneeSessionMentionSemestreEcue(
                selectedMention?.id, selectedSession?.semestre?.id, param?.anneeId,selectedSession?.id,
                selectedRow?.id);
            setCotation(data);

        } catch (error) {
          console.error("Erreur lors du chargement de la note :", error);
        }
    };
    loadCotation();
  }, [visible, selectedSession, selectedRow, param?.anneeId]);

  // ================= LOAD FILIERE BY DOMAINE =================
  useEffect(() => {
    if (!param.domaineId) return setFilieres([]);

    filiereService.getAllByDomaine(param.domaineId)
      .then(setFilieres)
      .catch(() => setFilieres([]));
  }, [param.domaineId]);

  // ================= LOAD MENTION BY FILIERE =================
  useEffect(() => {
    if (!param.filiereId) return setMentions([]);

    mentionService.getAllByFiliere(param.filiereId)
      .then(setMentions)
      .catch(() => setMentions([]));
  }, [param.filiereId]);

   // ================= LOAD SESSIONS BY INCREMENTOR =================
   useEffect(() => {
     if (incrementor < 0) return setSessions([]);

     sessionService
       .getAllByMentionIncrementor(incrementor)
       .then(setSessions)
       .catch(() => setSessions([]));
   }, [incrementor]);

  // ================= SELECT MENTION =================
  useEffect(() => {
    const found = mentions.find(m => String(m.id) === String(param.mentionId));

    if (found) {
      setSelectedMention(found);
      setIncrementor(found.numeroSemestreIncementor || 0);
    }
  }, [mentions, param.mentionId]);

  // ================= Load cotations by mentionId, anneeId et SemestreId =================
    useEffect(() => {
      if (!param.mentionId || !param.anneeId || !selectedSession?.semestre?.id) {
        setCotations([]);
        return;
      }

      let active = true;

      (async () => {
        try {
          const data = await cotationDetailService.getAllByMentionSemestreAnneeSession(
              param.mentionId, selectedSession.semestre.id,
              param.anneeId, selectedSession.id,
            );

          if (active) setCotations(data || []);
        } catch {
          if (active) setCotations([]);
        }
      })();

      return () => { active = false; };
    }, [param.mentionId, param.anneeId, selectedSession]);

  // ================= INSCRIPTIONS =================
useEffect(() => {
  if (
    !param?.anneeId ||
    !param?.mentionId ||
    !selectedSession?.semestre?.id ||
    !selectedSession?.id
  ) {
    setInscriptions([]);
    return;
  }

  inscriptionService
    .getAllByMentionAnneeSemestreSession(
      param?.mentionId,
      param?.anneeId,
      selectedSession?.semestre?.id,
      selectedSession?.id
    )
    .then((data) => {
      setInscriptions(data);
    })
    .catch((error) => {
      console.error(error);
      setInscriptions([]);
    });

}, [
  param?.mentionId,
  param?.anneeId,
  selectedSession?.semestre?.id,
  selectedSession?.id,
]);

useEffect(() => {
  console.log("inscriptions mises à jour :", inscriptions);
}, [inscriptions]);



  // ================= HELPERS =================
  const normalize = (t) =>
    String(t || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  const filteredData = useMemo(() => {
    const s = normalize(search);

    return cotations.filter(c =>
      normalize(`${c.mentionSemestreEcueDetail.ecueName} ${c?.mentionSemestreEcueDetail?.ecue?.ue?.intitule}`)
        .includes(s)
    );
  }, [search, cotations]);

  const groupedSessions = useMemo(() => {
    return (sessions || []).reduce((acc, item) => {
      const key = item?.semestre?.semestreName || "Autres";
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});
  }, [sessions]);

  // ================= ACTIONS =================
  const handleChange = (f) => (e) => {
    const v = e.target.value;

    setParam(p => ({
      ...p,
      [f]: v,
      ...(f === "domaineId" && { filiereId: "", mentionId: "" }),
      ...(f === "filiereId" && { mentionId: "" }),
    }));
  };

  const handleSelectMention = (m) => {
    setSelectedMention(m);

    setParam(p => ({
      ...p,
      mentionId: m.id,
    }));
  };

  const handleSelectSession = (s) => setSelectedSession(s);

  const handleEdit = (row) => {
    setSelectedRow(row.mentionSemestreEcueDetail);
    setVisible(true);
  };

  // ================= RENDER =================
  return (
    <div className="container-fluid px-2 px-md-2">
      <CCard className="shadow-sm">

        {/* HEADER */}
        <CCardHeader className="bg-light py-3 px-4">
          <div className="d-flex justify-content-between">
            <div>
              <h4 className="fw-bold mb-1">Liste des cotations</h4>
              <div className="text-medium-emphasis">
                Gestion académique des cotations
              </div>
            </div>

            <div>{selectedMention?.mentionName}</div>
          </div>
        </CCardHeader>

        <CCardBody>

        {/* FILTERS */}
        <CRow className="bg-light border rounded p-2 mb-2 g-1"
        >
          {[
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
          ].map((field) => (
            <CCol key={field.label} xs={12} sm={6} md={4} className="px-2">
              <CInputGroup>
                <CInputGroupText>
                  <CIcon icon={field.icon} />
                </CInputGroupText>

                <CFormSelect value={field.value} onChange={field.onChange}>
                  <option value="">{field.label}</option>

                  {field.options?.map((opt) => (
                    <option key={field.getValue(opt)} value={field.getValue(opt)}>
                      {field.getLabel(opt)}
                    </option>
                  ))}
                </CFormSelect>
              </CInputGroup>
            </CCol>
          ))}

        </CRow>

          <CRow className="g-4">

            {/* SIDEBAR */}
            <CCol lg={3}>
              <CCard className="bg-light">
                <CCardBody>

                  {/* SESSIONS */}
                  <div className="mb-2">
                    <div className="fw-bold mb-1">Période</div>

                    {Object.entries(groupedSessions).map(([semestre, list]) => (
                      <div key={semestre} className="mb-1">

                        <div className="d-flex align-items-center justify-content-between border rounded px-3 py-1 mb-1">
                          <div className="fw-bold text-primary">{semestre}</div>
                          <CBadge
                            color="primary"
                            shape="rounded-pill"
                          >{list.length}</CBadge>
                        </div>

                        <CListGroup>
                          {list.map(item => (
                            <CListGroupItem
                              key={item.id}
                              active={selectedSession?.id === item.id}
                              onClick={() => handleSelectSession(item)}
                              className="mb-1 py-1"
                              style={{ cursor: "hand" }}
                            >
                              {item.sessionName}
                            </CListGroupItem>
                          ))}
                        </CListGroup>
                      </div>
                    ))}
                  </div>

                  {/* MENTIONS */}
                  <div>
                    <div className="fw-bold mb-2">Mentions</div>

                    <CListGroup>
                      {mentions.map(m => (
                        <CListGroupItem
                          key={m.id}
                          active={selectedMention?.id === m.id}
                          onClick={() => handleSelectMention(m)}
                          style={{ cursor: "hand" }}
                          className="mb-1 py-1"
                        >
                          {m?.niveau?.intitule} {m?.intitule}
                        </CListGroupItem>
                      ))}
                    </CListGroup>
                  </div>

                </CCardBody>
              </CCard>
            </CCol>

            {/* CONTENT */}
            <CCol lg={9}>
              <CCard>
                <CCardBody>

                  {/* SEARCH */}
                  <div className="d-flex justify-content-between mb-3">
                    <div className="justify-content-center">{filteredData.length} élément(s)</div>

                    <CInputGroup style={{ maxWidth: 350 }}>
                      <CInputGroupText><CIcon icon={cilSearch} /></CInputGroupText>
                      <CFormInput placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)} />
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

                  ) : filteredData.length ===
                    0 ? (
                    <CAlert color="warning">
                      Aucun élement consecutif
                    </CAlert>

                  ) : (
                    <CTable hover className="align-middle mb-0 border">
                      <CTableHead className="table-light">
                        <CTableRow>
                          <CTableHeaderCell>ECUE</CTableHeaderCell>
                          <CTableHeaderCell>Crédit</CTableHeaderCell>
                          <CTableHeaderCell className="text-end">Actions</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>

                      <CTableBody>
                        {filteredData.map((row, i) => (
                          <CTableRow className="py-0" key={row?.mentionSemestreEcueDetail?.id || i}>
                            <CTableDataCell className="py-0">
                              <div className="fw-semibold">{row?.mentionSemestreEcueDetail?.ecueName}</div>
                              <small className="text-muted">{row?.ecue?.ue?.intitule}</small>
                            </CTableDataCell>

                            <CTableDataCell>
                                <CRow>
                                <CCol>
                                    <CBadge
                                      className={`px-2 py-1 rounded-pill border border-2 ${
                                        row?.estCote ? "border-success" : "border-danger"
                                      }`}
                                    >
                                      <span className="fw-bold text-dark">
                                        {row?.mentionSemestreEcueDetail?.credit ?? "-"}
                                      </span>
                                    </CBadge>
                                 </CCol>
                                  <CCol>
                                    <CBadge color="info">
                                        {row?.countWithCote || "0"} coté(s), {"  "}
                                        {row?.countManqueCote || "0"} manque de cote(s)
                                    </CBadge>
                                  </CCol>
                               </CRow>
                            </CTableDataCell>

                            <CTableDataCell className="text-end">
                               <div className="d-flex justify-content-end">
                                   <CButton
                                     color="light"
                                     size="sm"
                                     onClick={() => handleEdit(row)}
                                     >
                                     <CIcon icon={cilPencil} />
                                   </CButton>
                               </div>
                            </CTableDataCell>
                          </CTableRow>
                        ))}
                      </CTableBody>
                    </CTable>
                  )}
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      {selectedRow && (
        <CotationEtudiantsModal
          visible = {visible}
          setVisible = {setVisible}
          cotationService = {cotationService}
          param={{anneeId: param?.anneeId, mention: selectedMention, session:selectedSession, cotation: cotation}}
          row = {selectedRow}
          inscriptions = {inscriptions}
          onSubmit={handleModalSubmit}
        />
      )}
    </div>
  );
}