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

import cycleService from "@src/infrastructure/services/inscription/cycleService";
import Table from "@src/views/modules/shared/components/table";
import { useToast } from "@src/app/context/ToastContext";

import "@src/styles/global.css";

export default function CycleList() {

  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  const [cycles, setCycles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // LOAD DATA
  async function load() {

    try {

      setLoading(true);

      const data = await cycleService.getAll();

      setCycles(data || []);
      setError("");

    } catch (e) {

      console.error(e);

      setError(
        "Impossible de charger les cycles"
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
      "Voulez-vous vraiment supprimer ce cycle ?"
    );

    if (!confirmDelete) return;

    try {

      await cycleService.delete(id);

      setCycles((prev) =>
        prev.filter((cycle) => cycle.id !== id)
      );

      showToast(
        "Cycle supprimé avec succès !",
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
  function handleEdit(cycle) {

    navigate("/inscription/cycle/edit", {
      state: { cycle },
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
      header: "Description",
      accessor: "description",

      render: (row) => (
        <div className="text-muted">
          {row.description || "-"}
        </div>
      ),
    },

    {
      header: "Ordre",
      accessor: "ordre",

      render: (row) => (
        <div className="fw-semibold text-center">
          {row.ordre}
        </div>
      ),
    },

    {
      header: "Actions",
      accessor: "actions",

      render: (row) => (
        <div
          className="
            d-flex
            gap-2
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
              Liste des cycles
            </h5>

            <small className="text-medium-emphasis">
              Gestion des cycles académiques
            </small>

          </div>

          <CButton
            color="primary"
            className="d-flex align-items-center"
            onClick={() =>
              navigate("/inscription/cycle/edit")
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

          ) : cycles.length === 0 ? (

            <CAlert color="warning">
              Aucun cycle trouvé
            </CAlert>

          ) : (

            <Table
              columns={columns}
              data={cycles}
              itemsPerPage={7}
              enableSearch={true}
            />

          )}

        </CCardBody>

      </CCard>

    </div>
  );
}