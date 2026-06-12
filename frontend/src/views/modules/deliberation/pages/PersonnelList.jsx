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
} from "@coreui/react";

import {
  cilPlus,
  cilPencil,
  cilTrash,
  cilSearch,
} from "@coreui/icons";

import CIcon from "@coreui/icons-react";

import personnelService from "@src/infrastructure/services/deliberation/personnelService";
import Table from "@src/views/modules/shared/components/TableWithoutSearch";
import { useToast } from "@src/app/context/ToastContext";

export default function InscriptionList() {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  const [personnels, setPersonnels] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // LOAD DATA
  async function load() {
    try {
      setLoading(true);

      const data = await personnelService.getAll();

      setPersonnels(data || []);
      setError("");

    } catch (e) {
      console.error(e);

      setError(
        "Impossible de charger les personnels"
      );

    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [location.state]);

  // DELETE
  async function handleDelete(id) {
    const confirmDelete = window.confirm(
      "Voulez-vous vraiment supprimer ce personnel ?"
    );

    if (!confirmDelete) return;

    try {
      await personnelService.delete(id);

      setPersonnels((prev) =>
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
  function handleEdit(personnel) {
    navigate("/deliberation/personnel/edit", {
      state: { personnel },
    });
  }

  // TABLE COLUMNS
   const columns = [
     {
       header: "Noms",
       accessor: "noms",

       render: (row) => (
         <div className="d-flex align-items-center gap-2">

             <div
               className="
                 rounded-circle
                 bg-primary
                 text-white
                 fw-bold
                 d-flex
                 align-items-center
                 justify-content-center
               "
               style={{
                 width: 42,
                 height: 42,
                 minWidth: 42,
               }}
             >
               {`${row?.prenom?.charAt(0) || ""
                 }${row?.nom?.charAt(0) || ""
                 }`}
             </div>

           {/* INFOS */}
           <div className="d-flex flex-column">
             <span className="fw-semibold">
               {[
                 row?.nom?.toUpperCase(),
                 row?.postnom?.toUpperCase(),
                 row?.prenom?.toUpperCase(),
               ]
                 .filter(Boolean)
                 .join(" ")}
             </span>

             <small className="text-medium-emphasis">
               Né(e) le{" "}
               {row?.dateNaissance
                 ? new Date(row?.dateNaissance).toLocaleDateString("fr-FR")
                 : "-"}, {row?.sexe ?? "-"}
             </small>
           </div>
         </div>
       ),
     },

      {
        header: "Téléphone",
        accessor: "telephone",

        render: (row) => (
            row?.telephone
        ),
      },

     {
       header: "Grade",
       accessor: "grade",

       render: (row) => (
           row?.grade
       ),
     },

     {
       header: "Actions",
       accessor: "actions",

       render: (row) => (
         <div className="d-flex gap-2 justify-content-end">

           <CButton
             color="light"
             size="sm"
             className="border"
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
       ),
     },
   ];

  const filteredData = useMemo(() => {

    const keyword = search.toLowerCase().trim();

    return personnels.filter(
      (row) => `${row?.nom || ""} ${row?.postnom || ""} ${row?.prenom || ""}`
          .toLowerCase()
          .includes(keyword)
    );

  }, [search, personnels]);

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
              Liste des personnels academiques
            </h5>

            <small className="text-medium-emphasis">
              Gestion des personnels académiques
            </small>
          </div>

          <CButton
            color="primary"
            onClick={() =>
              navigate("/deliberation/personnel/edit")
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

            <div className="d-flex flex-column flex-lg-row justify-content-between gap-3 mb-0 px-3 mb-1">
              <div>

                <div className="small text-medium-emphasis mt-2">
                   <span className="fw-bold">{filteredData.length}</span> personnel(s)
                </div>

              </div>

              <div
                style={{
                  width: "100%",
                  maxWidth: 350,
                }}>
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

          ) : personnels.length === 0 ? (
            <CAlert color="warning">
              Aucun personnel académique trouvé
            </CAlert>

          ) : (
            <Table
              columns={columns}
              data={filteredData}
              itemsPerPage={7}
              enableSearch={true}
            />
          )}
        </CCardBody>
      </CCard>
    </div>
  );
}