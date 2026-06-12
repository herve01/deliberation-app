import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CSpinner,
  CAlert,
  CBadge,
  CInputGroup,
  CInputGroupText,
  CFormInput,
  CFormSelect,
  CRow,
  CCol,  CTable, CTableHead, CTableBody, CTableRow,
         CTableHeaderCell, CTableDataCell
} from "@coreui/react";

import {
  cilPlus,
  cilPencil,
  cilTrash,
  cilSearch,
  cilCalendar,
} from "@coreui/icons";

import CIcon from "@coreui/icons-react";

import juryMembreDetailService from "@src/infrastructure/services/deliberation/juryMembreDetailService";
import anneeService from "@src/infrastructure/services/inscription/anneeService";

import { useToast } from "@src/app/context/ToastContext";

const STORAGE = {
  anneeId: "anneeIdStored",
};

export default function MembreJuryList() {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  const [annees, setAnnees] = useState([]);

  const [juries, setJuries] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [param, setParam] = useState({
      anneeId: localStorage.getItem(STORAGE.anneeId) || "",
  })
  const [error, setError] = useState("");

  // LOAD DATA

    useEffect(() => {
      async function load() {
        try {
          setLoading(true);
          const data = await anneeService.getAll();

          setAnnees(data || []);

        } catch {
          setError("Erreur chargement données <<domaines et année academqiue>>");
        } finally {
          setLoading(false);
        }
      }
      load();
    }, [location.state]);

  useEffect(() => {
    const loadJuries = async () => {
        if (!param?.anneeId) return setJuries([]);

        try {
            const data = await juryMembreDetailService.getAllByAnnee(param?.anneeId)
            setJuries(data || []);

            console.log("Nombre de jurys :", data?.length || 0);

            console.log("data de jurys :", data);

        } catch (error) {
          console.error("Erreur lors du chargement de la note :", error);
        }
    };
    loadJuries();
  }, [param?.anneeId]);

const handleChange = (f) => (e) => {
  const v = e.target.value;

  setParam((p) => ({
    ...p,
    [f]: v,
  }));

  if (f === "anneeId") {
    localStorage.setItem(STORAGE.anneeId, v);
  }
};


  // DELETE
  async function handleDelete(id) {
    const confirmDelete = window.confirm(
      "Voulez-vous vraiment supprimer ce personnel ?"
    );

    if (!confirmDelete) return;

    try {
      await juryMembreDetailService.delete(id);

      setJuries((prev) =>
        prev.filter((i) => i.id !== id)
      );

      showToast(
        "Inscription supprimée avec succès !",
        "success"
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
  function handleEdit(jury) {
    navigate("/deliberation/membre-jury/edit", {
      state: { jury },
    });
  }

  const normalize = (t) =>
    String(t || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

const filteredData = useMemo(() => {
  const keyword = normalize(search);

  if (!keyword) return juries;

  return juries.filter((row) => {
    const detailsText =
      row?.details
        ?.map((d) => {
          const p = d?.personnel || {};

          return [d?.role, p?.matricule, p?.nom, p?.postnom, p?.prenom,]
            .filter(Boolean)
            .join(" ");
        })
        .join(" ") || "";

    const text = `
      ${row?.mention?.mentionName || ""}
      ${row?.annee?.annee || ""}
      ${detailsText}
    `;

    return normalize(text).includes(keyword);
  });
}, [search, juries]);

  return (
    <div className="container-fluid px-3">
      <CCard className="border-1 shadow-sm">
        {/* HEADER */}
        <CCardHeader
          className="
            d-flex
            justify-content-between
            align-items-center
            bg-light
            py-3
          "
        >
          <div>
            <h5 className="mb-0 fw-bold">
              Liste des juries academiques
            </h5>

            <small className="text-medium-emphasis">
              Gestion des juries académiques
            </small>
          </div>

          <CButton
            color="primary"
            onClick={() =>
              navigate("/deliberation/membre-jury/edit")
            }
          >
            <CIcon
              icon={cilPlus}
              className="me-2"
            />
            Ajouter
          </CButton>
        </CCardHeader>

        {/* BODY */}
        <CCardBody>

            <div className="d-flex flex-column flex-lg-row justify-content-between gap-3 mb-0 px-3 mb-2">
                <div className="small text-medium-emphasis mt-2">
                   <span className="fw-bold">{filteredData.length}</span> mention(s)
                </div>
              <div
              className = "justify-content-end"
            >

            <CRow>
               <CCol md={5}>
                    <CInputGroup>
                      <CInputGroupText>
                        <CIcon icon={cilCalendar} />
                      </CInputGroupText>

                      <CFormSelect
                      name="anneId"
                      value={param?.anneeId}
                      onChange={handleChange("anneeId")}
                      >
                        <option value="">Année academique</option>

                        {annees.map((a) => (
                          <option key={a.id}
                          value={a.id}>
                            {a.annee}
                          </option>
                        ))}
                      </CFormSelect>
                    </CInputGroup>
               </CCol>

              <CCol md={7}>
               <CInputGroup>
                 <CInputGroupText>
                   <CIcon icon={cilSearch} />
                 </CInputGroupText>

                 <CFormInput
                   placeholder="Rechercher..."
                   value={search}
                   onChange={(e) => setSearch(e.target.value)
                   }
                 />
               </CInputGroup>
              </CCol>
            </CRow>
              </div>
            </div>
          {loading ? (
            <div className="text-center py-5">
              <CSpinner color="primary" />

              <div className="mt-2">
                Chargement...
              </div>

            </div>

          ) : error ? (
            <CAlert color="danger">
              {error}
            </CAlert>

          ) : juries.length === 0 ? (
            <CAlert color="warning">
              Aucun personnel académique trouvé
            </CAlert>

          ) : (

            <div className="px-3">
            <CTable hover className="align-middle mt-3 border py-3">
              <CTableHead className="table-light">
                <CTableRow>
                  <CTableHeaderCell>Mention</CTableHeaderCell>
                  <CTableHeaderCell>President</CTableHeaderCell>
                   <CTableHeaderCell>Secretaire</CTableHeaderCell>
                   <CTableHeaderCell>Membre</CTableHeaderCell>
                  <CTableHeaderCell className="text-end">Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>

              <CTableBody>
                {filteredData.map((row, i) => (
                  <CTableRow className="py-0" key={row?.mentionSemestreEcueDetail?.id || i}>
                    <CTableDataCell className="py-0">
                      {row?.mention?.mentionName}
                    </CTableDataCell>

                    <CTableDataCell>
                      {(() => {
                        const personnel =
                          row?.details?.find((j) => j?.role === "PRESIDENT")?.personnel || {};

                        const fullName = [
                          personnel?.nom?.toUpperCase(),
                          personnel?.prenom,
                        ]
                          .filter(Boolean)
                          .join(" ");

                        return fullName || "-";
                      })()}
                    </CTableDataCell>

                    <CTableDataCell>
                      {(() => {
                        const personnel =
                          row?.details?.find((j) => j?.role === "SECRETAIRE")?.personnel || {};

                        const fullName = [
                          personnel?.nom?.toUpperCase(),
                          personnel?.prenom,
                        ]
                          .filter(Boolean)
                          .join(" ");

                        return fullName || "-";
                      })()}
                    </CTableDataCell>

                    <CTableDataCell>
                      {(() => {
                        const personnel =
                          row?.details?.find((j) => j?.role === "MEMBRE")?.personnel || {};

                        const fullName = [
                          personnel?.nom?.toUpperCase(),
                          personnel?.prenom,
                        ]
                          .filter(Boolean)
                          .join(" ");

                        return fullName || "-";
                      })()}
                    </CTableDataCell>

                    <CTableDataCell className="text-end">
                       <div className="d-flex gap-2 justify-content-end">
                           <CButton
                             color="light"
                             size="sm"
                             onClick={() => handleEdit(row)}
                             >
                             <CIcon icon={cilPencil} />
                           </CButton>

                          <CButton
                            color="light"
                            size="sm"
                            className="border text-danger"
                            onClick={() => handleDelete(row.id)}
                          >
                            <CIcon icon={cilTrash} />
                          </CButton>
                       </div>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
            </div>
          )
      }
        </CCardBody>
      </CCard>
    </div>
  );
}