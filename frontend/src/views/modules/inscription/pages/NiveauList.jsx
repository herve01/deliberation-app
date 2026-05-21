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

import niveauService from "@src/infrastructure/services/inscription/niveauService";
import Table from "@src/views/modules/shared/components/table";
import { useToast } from "@src/app/context/ToastContext";

import "@src/styles/global.css";

export default function NiveauList() {

  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  const [niveaux, setNiveaux] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // LOAD DATA
  async function load() {
    try {
      setLoading(true);

      const data = await niveauService.getAll();

      setNiveaux(data || []);
      setError("");

    } catch (e) {
      console.error(e);
      setError("Impossible de charger les niveaux");
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
      "Voulez-vous vraiment supprimer ce niveau ?"
    );

    if (!confirmDelete) return;

    try {

      await niveauService.delete(id);

      setNiveaux((prev) =>
        prev.filter((n) => n.id !== id)
      );

      showToast("Niveau supprimé avec succès !");

    } catch (e) {
      console.error(e);
      showToast(
        "Erreur lors de la suppression",
        "error"
      );
    }
  }

  // EDIT
  function handleEdit(niveau) {

    navigate("/inscription/niveau/edit", {
      state: { niveau },
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
      header: "Actions",
      accessor: "actions",
      render: (row) => (
        <div
          className="d-flex gap-1 justify-content-end"
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
              Liste des niveaux
            </h5>

            <small className="text-medium-emphasis">
              Gestion des niveaux académiques
            </small>
          </div>

          <CButton
            color="primary"
            onClick={() =>
              navigate("/inscription/niveau/edit")
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

          ) : niveaux.length === 0 ? (

            <CAlert color="warning">
              Aucun niveau trouvé
            </CAlert>

          ) : (

            <Table
              columns={columns}
              data={niveaux}
              itemsPerPage={5}
              enableSearch={true}
            />
          )}
        </CCardBody>
      </CCard>
    </div>
  );
}