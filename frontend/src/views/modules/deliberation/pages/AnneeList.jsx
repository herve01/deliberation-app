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

import anneeService from "@src/infrastructure/services/inscription/anneeService";
import utils from "@src/views/modules/utils";
import Table from "@src/views/modules/shared/components/table";
import { useToast } from "@src/app/context/ToastContext";

import "@src/styles/global.css";

export default function AnneeList() {

  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  const [annees, setAnnees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // LOAD DATA
  async function load() {

    try {

      setLoading(true);

      const data = await anneeService.getAll();

      setAnnees(data || []);
      setError("");

    } catch (e) {

      console.error(e);

      setError(
        "Impossible de charger les années académiques"
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
      "Voulez-vous vraiment supprimer cette année académique ?"
    );

    if (!confirmDelete) return;

    try {

      await anneeService.delete(id);

      setAnnees((prev) =>
        prev.filter((a) => a.id !== id)
      );

      showToast(
        "Année académique supprimée avec succès !"
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
  function handleEdit(annee) {

    navigate(
      "/inscription/annee-academique/edit",
      {
        state: { annee },
      }
    );
  }

  // TABLE COLUMNS
  const columns = [
    {
      header: "Année académique",
      accessor: "annee",
      render: (row) => (
        <div className="fw-semibold">
          {row.annee}
        </div>
      ),
    },
    {
      header: "Date d'ouverture",
      accessor: "dateOuverture",
      render: (row) => (
        <span>
          {utils.formatDate(
            row.dateOuverture
          )}
        </span>
      ),
    },
    {
      header: "Date de clôture",
      accessor: "dateCloture",
      render: (row) => (
        <span>
          {utils.formatDate(
            row.dateCloture
          )}
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
              Liste des années académiques
            </h5>

            <small className="text-medium-emphasis">
              Gestion des années académiques
            </small>
          </div>

          <CButton
            color="primary"
            onClick={() =>
              navigate(
                "/inscription/annee-academique/edit"
              )
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

          ) : annees.length === 0 ? (

            <CAlert color="warning">
              Aucune année académique trouvée
            </CAlert>

          ) : (

            <Table
              columns={columns}
              data={annees}
              itemsPerPage={7}
              enableSearch={true}
            />
          )}
        </CCardBody>
      </CCard>
    </div>
  );
}