import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CSpinner,
  CAlert,
} from "@coreui/react";

import {
  cilPlus,
  cilPencil,
  cilTrash,
} from "@coreui/icons";

import CIcon from "@coreui/icons-react";

import filiereService from "@src/infrastructure/services/inscription/filiereService";
import Table from "@src/views/modules/shared/components/table";
import { useToast } from "@src/app/context/ToastContext";

import "@src/styles/global.css";

export default function FiliereList() {

  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  const [filieres, setFilieres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // LOAD DATA
  async function load() {
    try {

      setLoading(true);

      const data =
        await filiereService.getWithDomaineAll(true);

      setFilieres(data || []);
      setError("");

    } catch (e) {

      console.error(e);
      setError(
        "Impossible de charger les filières"
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
      "Voulez-vous vraiment supprimer cette filière ?"
    );

    if (!confirmDelete) return;

    try {

      await filiereService.delete(id);

      setFilieres((prev) =>
        prev.filter((f) => f.id !== id)
      );

      showToast(
        "Filière supprimée avec succès !"
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
  function handleEdit(filiere) {

    navigate("/inscription/filiere/edit", {
      state: { filiere },
    });
  }

  // TABLE COLUMNS
  const columns = [
    {
      header: "Intitulé",
      accessor: "intitule",
      render: (row) => (
        <div className="fw-semibold">
          {row.intitule}
        </div>
      ),
    },
    {
      header: "Domaine",
      accessor: "domaine",
      render: (row) => (
        <span>
          {row?.domaine?.intitule || "-"}
        </span>
      ),
    },
    {
      header: "Actions",
      accessor: "actions",
      render: (row) => (
        <div
          className="
            d-flex
            gap-1
            justify-content-end
          "
        >
          <CButton
            color="warning"
            size="sm"
            variant="outline"
            className="
              d-flex
              align-items-center
              justify-content-center
            "
            onClick={() => handleEdit(row)}
          >
            <CIcon icon={cilPencil} />
          </CButton>

          <CButton
            color="danger"
            size="sm"
            variant="outline"
            className="
              d-flex
              align-items-center
              justify-content-center
            "
            onClick={() => handleDelete(row.id)}
          >
            <CIcon icon={cilTrash} />
          </CButton>
        </div>
      ),
    },
  ];

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
              Liste des filières
            </h5>

            <small className="text-medium-emphasis">
              Gestion des filières académiques
            </small>
          </div>

          <CButton
            color="primary"
            onClick={() =>
              navigate("/inscription/filiere/edit")
            }
          >
            <CIcon icon={cilPlus} className="me-2" />
            Ajouter
          </CButton>
        </CCardHeader>

        {/* BODY */}
        <CCardBody>

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

          ) : filieres.length === 0 ? (

            <CAlert color="warning">
              Aucune filière trouvée
            </CAlert>

          ) : (

            <Table
              columns={columns}
              data={filieres}
              itemsPerPage={7}
              enableSearch={true}
            />
          )}
        </CCardBody>
      </CCard>
    </div>
  );
}