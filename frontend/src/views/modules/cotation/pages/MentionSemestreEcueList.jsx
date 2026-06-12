import React, { useEffect, useMemo, useState } from "react";

import {
  useNavigate,
  useLocation,
} from "react-router-dom";

import {
  CCard, CRow, CCol, CCardBody, CCardHeader,
  CButton, CSpinner, CAlert, CBadge,
  CFormSelect, CInputGroup, CInputGroupText,
  CListGroup, CListGroupItem, CFormInput,
  CTable, CTableHead, CTableBody, CTableRow,
  CTableHeaderCell, CTableDataCell
} from "@coreui/react";

import {
    cilPlus,
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
import semestreService from "@src/infrastructure/services/cotation/semestreService";

import mentionSemestreEcueDetailService from "@src/infrastructure/services/cotation/mentionSemestreEcueDetailService";

import { useToast } from "@src/app/context/ToastContext";

const STORAGE = {
  anneeId: "anneeIdStored",
  domaineId: "domaineIdStored",
  filiereId: "filiereIdStored",
  mention: "mentionStored",
  semestre: "semestreStored",
};

export default function MentionEcueDetailList() {

  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  const [domaines, setDomaines] = useState([]);
  const [filieres, setFilieres] = useState([]);
  const [mentions, setMentions] = useState([]);
  const [annees, setAnnees] = useState([]);
  const [semestres, setSemestres] = useState([]);

    const [param, setParam] = useState({
      anneeId: localStorage.getItem(STORAGE.anneeId) || "",
      domaineId: localStorage.getItem(STORAGE.domaineId) || "",
      filiereId: localStorage.getItem(STORAGE.filiereId) || "",
      mention: localStorage.getItem(STORAGE.mention) || "",
      semestre: localStorage.getItem(STORAGE.semestre) || "",
    });

  const [items, setItems] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");
   const [search, setSearch] = useState("");

   const [incrementor, setIncrementor] = useState(0);

   useEffect(() => {
       async function load() {
         try {
           setLoading(true);

           const [d, a, data] = await Promise.all([
             domaineService.getAll(),
             anneeService.getAll(),
             mentionSemestreEcueDetailService.getAll(),
           ]);

           setDomaines(d || []);
           setAnnees(a || []);
            setItems(data || []);
         } catch {
           setError("Erreur chargement données");
         } finally {
           setLoading(false);
         }
       }

       load();
     }, [location.state]);

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

useEffect(() => {
  const found = mentions.find(
    (m) => String(m.id) === String(param.mention)
  );

  if (found) {
    setIncrementor(
      found.numeroSemestreIncementor || 0
    );
  } else {
    setIncrementor(0);
  }
}, [mentions, param.mention]);

  useEffect(() => {
    if (incrementor < 0) return setSemestres([]);

    semestreService
      .getAllByMentionIncrementor(incrementor)
      .then(setSemestres)
      .catch(() => setSemestres([]));
  }, [incrementor]);

  // DELETE
  async function handleDelete(id) {

    const confirmDelete =
      window.confirm(
        "Voulez-vous vraiment supprimer cet élément ?"
      );

    if (!confirmDelete) return;

    try {

      await mentionEcueDetailService.delete(
        id
      );

      setItems((prev) =>
        prev.filter(
          (item) => item.id !== id
        )
      );

      showToast(
        "Suppression effectuée avec succès !"
      );

    } catch (e) {

      console.error(e);

      showToast(
        "Erreur lors de la suppression",
        "error"
      );
    }
  }

  // EDIT
  function handleEdit(item) {
    navigate(
      "/cotation/mention-ecue-details/edit",{state: {mentionEcueDetail: item,},}
    );
  }

    const handleChange = (f) => (e) => {
      const v = e.target.value;

      setParam(p => ({
        ...p,
        [f]: v,
        ...(f === "domaineId" && { filiereId: "", mentionId: "" }),
        ...(f === "filiereId" && { mentionId: "" }),
      }));
    };

const handleSelectMention = (mention) => {
  setParam((prev) => ({
    ...prev,
    mention: mention.id,
    semestre: "",
  }));

  localStorage.setItem(STORAGE.mention, mention.id);
  setIncrementor(mention.numeroSemestreIncementor || 0);
};

const handleSelectSession = (semestre) => {
  setParam((prev) => ({
    ...prev,
    semestre: semestre.id,
  }));

  localStorage.setItem(STORAGE.semestre, semestre.id);
};

  // ================= HELPERS =================
  const normalize = (t) =>
    String(t || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  const filteredData = useMemo(() => {
    const s = normalize(search);

    return items.filter(i =>
      normalize(`${i.ecue?.intitule} ${i.ecue?.ue?.intitule} `)
        .includes(s)
    );
  }, [search, items]);

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

            <div>{param?.mention?.mentionName}</div>
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
            <CCol key={field.label} xs={12} sm={6} md={4}>
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
                    <div className="fw-bold mb-1">Semestre</div>
                        <CListGroup>
                          {semestres.map(item => (
                            <CListGroupItem
                              key={item.id}
                              active={param?.semestre?.id === item.id}
                              onClick={() => handleSelectSession(item)}
                              className="mb-1 py-1"
                              style={{ cursor: "hand" }}
                            >
                              {item.semestreName}
                            </CListGroupItem>
                          ))}
                        </CListGroup>
                  </div>

                  {/* MENTIONS */}
                  <div>
                    <div className="fw-bold mb-2">Mentions</div>

                    <CListGroup>
                      {mentions.map(m => (
                        <CListGroupItem
                          key={m.id}
                          active={param?.mention?.id === m.id}
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
                            <CTableHeaderCell>UE</CTableHeaderCell>
                            <CTableHeaderCell>Intitulé</CTableHeaderCell>
                            <CTableHeaderCell>Crédit</CTableHeaderCell>
                            <CTableHeaderCell>CMI</CTableHeaderCell>
                            <CTableHeaderCell>TD</CTableHeaderCell>
                            <CTableHeaderCell>TP</CTableHeaderCell>
                            <CTableHeaderCell>Total</CTableHeaderCell>
                            <CTableHeaderCell className="text-end"></CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>

                      <CTableBody>
                        {filteredData.map((row, i) => (
                          <CTableRow className="py-0" key={row?.inscription?.id || i}>
                            <CTableDataCell className="py-0">
                                <div className="fw-semibold"> {row?.ecue?.ue?.code || "-"}</div>
                            </CTableDataCell>

                           <CTableDataCell className="py-0 text-wrap"
                                         >
                               <div className="fw-semibold"> {row?.ecue?.intitule || "-"}</div>
                           </CTableDataCell>

                            <CTableDataCell>
                                <div className="fw-semibold"> {row.credit || 0}</div>
                            </CTableDataCell>

                            <CTableDataCell>
                                <div className="fw-semibold"> {row?.ecue?.nombreHeureCmi || 0} h</div>
                            </CTableDataCell>

                            <CTableDataCell>
                                <div className="fw-semibold">{row?.ecue?.nombreHeureTd || 0} h</div>
                            </CTableDataCell>

                            <CTableDataCell>
                                <div className="fw-semibold"> {row?.ecue?.nombreHeureTp || 0} h</div>
                            </CTableDataCell>

                            <CTableDataCell>
                              {(() => {
                                const total =
                                  (Number(row?.ecue?.nombreHeureCmi) || 0) +
                                  (Number(row?.ecue?.nombreHeureTd) || 0) +
                                  (Number(row?.ecue?.nombreHeureTp) || 0);

                                return <div className="fw-semibold">{total} h</div>;
                              })()}
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
                     </div>
                  )}
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </div>
  );
}