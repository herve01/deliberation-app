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
  cilSearch,
  cilInfo,
} from "@coreui/icons";

import CIcon from "@coreui/icons-react";

import domaineService from "@src/infrastructure/services/inscription/domaineService";
import filiereService from "@src/infrastructure/services/inscription/filiereService";
import mentionService from "@src/infrastructure/services/inscription/mentionService";
import anneeService from "@src/infrastructure/services/inscription/anneeService";
import sessionService from "@src/infrastructure/services/cotation/sessionService";

import deliberationDetailService from "@src/infrastructure/services/deliberation/deliberationDetailService";
import CotationEtudiantModalDetails from "@src/views/modules/deliberation/pages/modal/CotationEtudiantModalDetails";
import juryMembreDetailService from "@src/infrastructure/services/deliberation/juryMembreDetailService";

const STORAGE = {
  anneeId: "anneeIdStored",
  domaineId: "domaineIdStored",
  filiereId: "filiereIdStored",
  mentionId: "mentionIdStored",
  session: "sessionStored",
};

export default function DeliberationList() {

  const location = useLocation();

  // ================= STATE =================
  const [deliberations, setDeliberations] = useState([]);

  const [domaines, setDomaines] = useState([]);
  const [filieres, setFilieres] = useState([]);
  const [mentions, setMentions] = useState([]);
  const [annees, setAnnees] = useState([]);
  const [sessions, setSessions] = useState([]);

  const [deliberationDetails, setDeliberationDetails] = useState({ });
  const [juryMembre, setJuryMembre] = useState(null);

  const [selectedMention, setSelectedMention] = useState(null);
  const [selectedSession, setSelectedSession] = useState(
    JSON.parse(localStorage.getItem(STORAGE.session) || "null")
  );

  const [selectedDeliberation,setSelectedDeliberation] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [visible, setVisible] = useState(false);

  const [incrementor, setIncrementor] = useState(0);

  const [param, setParam] = useState({
    anneeId: localStorage.getItem(STORAGE.anneeId) || "",
    domaineId: localStorage.getItem(STORAGE.domaineId) || "",
    filiereId: localStorage.getItem(STORAGE.filiereId) || "",
    mentionId: localStorage.getItem(STORAGE.mentionId) || "",
  });

  // ================= LOCAL STORAGE =================
  useEffect(() => {
    localStorage.setItem(STORAGE.anneeId, param.anneeId || "");
    localStorage.setItem(STORAGE.domaineId, param.domaineId || "");
    localStorage.setItem(STORAGE.filiereId, param.filiereId || "");
    localStorage.setItem(STORAGE.mentionId, param.mentionId || "");
    localStorage.setItem(STORAGE.session, selectedSession ? JSON.stringify(selectedSession) : ""
    );

  }, [param, selectedSession]);

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


  useEffect(() => {
    const loadDeliberation = async () => {
      if (!param?.anneeId || !selectedMention?.id || !selectedSession?.id) {
        setDeliberations([]);
        return;
      }

      try {
          const data = await deliberationDetailService.
          getAllByAnneeMentionSesmestreSession(param?.anneeId, selectedMention?.id,
              selectedSession?.semestre?.id, selectedSession?.id);

          setDeliberations(data);

          console.log('test session', selectedSession);

      } catch (error) {
        console.error("Erreur lors du chargement de la liste de déliberation :", error);
        setDeliberations([]);
      }
    };

    loadDeliberation();

  }, [param?.anneeId, selectedMention?.id, selectedSession]);

  useEffect(() => {
      const loadJuryMembre = async () => {
        if (!param?.anneeId || !selectedMention?.id) {
          setJuryMembre({});
          return;
        }

        try {
            const data = await juryMembreDetailService.getByAnneeMention(param?.anneeId, selectedMention?.id);

            setJuryMembre(data);

        } catch (error) {
          console.error("Erreur lors du chargement de la liste de déliberation :", error);
          setJuryMembre({});
        }
      };

      loadJuryMembre();

    }, [param?.anneeId, selectedMention?.id]);


  // ================= FILIERES =================
  useEffect(() => {
    if (!param.domaineId) return setFilieres([]);

    filiereService
      .getAllByDomaine(param.domaineId)
      .then(setFilieres)
      .catch(() => setFilieres([]));
  }, [param.domaineId]);

  // ================= MENTIONS =================
  useEffect(() => {
    if (!param.filiereId) return setMentions([]);

    mentionService
      .getAllByFiliere(param.filiereId)
      .then(setMentions)
      .catch(() => setMentions([]));
  }, [param.filiereId]);

  // ================= SELECT MENTION =================
  useEffect(() => {
    const found = mentions.find(m => String(m.id) === String(param?.mentionId));

    if (found) {
      setSelectedMention(found);
      setIncrementor(found.numeroSemestreIncementor || 0);

      setParam(prev => ({
        ...prev,
        mentionId : found.id
      }));
    }
  }, [mentions, param?.mentionId]);

  // ================= SESSIONS =================
useEffect(() => {
  if (incrementor < 0) {
    setSessions([]);
    return;
  }

  sessionService
    .getAllByWithoutMentionIncrementor(incrementor)
    .then((data) => {
      const defaultSession = {
          id: "-1",
          semestre: {
            id: "-1",
            numero: 3,
          },
          numero: 3,
      };
      setSessions([...data, defaultSession]);
    })
    .catch(() => setSessions([]));
}, [incrementor]);

  // ================= HELPERS =================
  const normalize = (t) =>
    String(t || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  const filteredData = useMemo(() => {
    const s = normalize(search);

    return deliberations.filter(d =>
      normalize(`${d.inscription?.etudiant?.nom} ${d.inscription?.etudiant?.postnom} ${d.inscription.etudiant?.prenom}`)
        .includes(s)
    );
  }, [search, deliberations]);

  const groupedSessions = useMemo(() => {
    return (sessions || []).reduce((acc, item) => {
      const key = item?.semestre?.semestreName || "TOUT";
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
    setSelectedDeliberation(row);
    setVisible(true);
  };

    useEffect(() => {
      const loadDeliberationDetaitls = async () => {

        if (!selectedDeliberation || !selectedSession?.id) {
          setDeliberationDetails({});
          return;
        }

        try {
            var data = deliberationDetailService.
            getDetailByInscriptionSesmestreSession(selectedDeliberation.inscription.id,
                selectedSession?.semestre?.id, selectedSession?.id)
                  .then((data) => {
                    setDeliberationDetails(data);
                  });

        } catch (error) {
          console.error("Erreur lors du chargement de la liste de déliberation :", error);
         setDeliberationDetails({});
        }
      };

      loadDeliberationDetaitls();

    }, [visible, selectedDeliberation, selectedSession ]);

  // ================= RENDER =================
  return (
    <div className="container-fluid px-2 px-md-2">
      <CCard className="shadow-sm">

        {/* HEADER */}
        <CCardHeader className="bg-light py-3 px-4">
          <div className="d-flex justify-content-between">
            <div>
              <h4 className="fw-bold mb-1">Liste des étudiants délibérés</h4>
              <div className="text-medium-emphasis">
                Gestion académique des déliberations
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
                              {item.sessionName || "Semestre"}
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
                      Aucun etudiant inscrit
                    </CAlert>

                  ) : (
                      <div className="table-responsive">
                    <CTable hover className="align-middle mb-0 border">
                      <CTableHead className="table-light">
                        <CTableRow>
                            <CTableHeaderCell>Étudiant</CTableHeaderCell>
                            <CTableHeaderCell>Crédits</CTableHeaderCell>
                            <CTableHeaderCell>Validés</CTableHeaderCell>
                            <CTableHeaderCell>Transférés</CTableHeaderCell>
                            <CTableHeaderCell>Moyenne</CTableHeaderCell>
                            <CTableHeaderCell>Décision</CTableHeaderCell>
                            <CTableHeaderCell className="text-end"></CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>

                      <CTableBody>
                        {filteredData.map((row, i) => (
                          <CTableRow className="py-0" key={row?.inscription?.id || i}>
                            <CTableDataCell className="py-0">
                        <CCol className="d-flex align-items-center py-1 gap-3">
                          {row?.inscription?.photo ? (
                            <img
                              src={row?.inscription?.photo}
                              alt="Photo étudiant"
                              width={40}
                              height={40}
                              className="rounded-circle border shadow-sm"
                              style={{ objectFit: "cover" }}
                            />
                          ) : (
                            <div
                              className="rounded-circle text-white fw-bold d-flex align-items-center justify-content-center shadow-sm"
                              style={{
                                width: 40,
                                height: 40,
                                background: "linear-gradient(135deg,#321fdb,#4f46e5)"
                              }}
                            >
                              {`${row?.inscription?.etudiant?.prenom?.charAt(0) || ""}${row?.inscription?.etudiant?.nom?.charAt(0) || ""}`}
                            </div>
                          )}

                          <div>
                            <div className="fw-semibold text-dark">
                              {[
                                row?.inscription?.etudiant?.nom?.toUpperCase(),
                                row?.inscription?.etudiant?.postnom?.toUpperCase(),
                                row?.inscription?.etudiant?.prenom
                              ]
                                .filter(Boolean)
                                .join(" ")}
                            </div>
                          </div>
                        </CCol>
                            </CTableDataCell>

                            <CTableDataCell>
                                <div className="fw-semibold">{row?.deliberation?.credits ?? "-"}</div>
                            </CTableDataCell>

                            <CTableDataCell>
                                <div className="fw-semibold">{row?.deliberation?.valides ?? "-"}</div>
                            </CTableDataCell>

                            <CTableDataCell>
                                <div className="fw-semibold">{row?.deliberation?.transferes ?? "-"}</div>
                            </CTableDataCell>

                            <CTableDataCell>
                                <div className="fw-semibold">{row?.deliberation?.moyenne ?? "-"}</div>
                            </CTableDataCell>

                            <CTableDataCell>
                                <div className="fw-semibold">{row?.deliberation?.decision ?? "-"}</div>
                            </CTableDataCell>

                            <CTableDataCell className="text-end">
                               <div className="d-flex justify-content-end">
                                   <CButton
                                     color="light"
                                     size="sm"
                                     onClick={() => handleEdit(row)}
                                     >
                                     <CIcon icon={cilInfo} />
                                   </CButton>
                               </div>
                            </CTableDataCell>
                          </CTableRow>
                        ))}
                      </CTableBody>
                    </CTable>
                     </div>
                  )}
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

           {selectedDeliberation && (
              <CotationEtudiantModalDetails
                visible = {visible}
                setVisible = {setVisible}
                deliberation = {deliberationDetails}
                param={{anneeId: param?.anneeId,
                    mention: selectedMention,
                    session:selectedSession,
                    juryMembre : juryMembre
                    }}
              />
            )}
    </div>
  );
}