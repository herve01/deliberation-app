import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CSpinner,
  CAlert,
  CBadge,
} from "@coreui/react";

import {
  cilPlus,
  cilPencil,
  cilTrash,
} from "@coreui/icons";

import CIcon from "@coreui/icons-react";

import uniteEnseignementService from "@src/infrastructure/services/cotation/uniteEnseignementService";
import Table from "@src/views/modules/shared/components/table";
import { useToast } from "@src/app/context/ToastContext";

import "@src/styles/global.css";

export default function UniteEnseignementList() {

  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  const [ues, setUes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // LOAD DATA
  async function load() {

    try {

      setLoading(true);

      const data =
        await uniteEnseignementService.getAll();

      setUes(data || []);
      setError("");

    } catch (e) {

      console.error(e);

      setError(
        "Impossible de charger les unités d’enseignement"
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
      "Voulez-vous vraiment supprimer cette unité d’enseignement ?"
    );

    if (!confirmDelete) return;

    try {

      await uniteEnseignementService.delete(id);

      setUes((prev) =>
        prev.filter((ue) => ue.id !== id)
      );

      showToast(
        "Unité d’enseignement supprimée avec succès !"
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
  function handleEdit(ue) {

    navigate(
      "/cotation/unite-enseignement/edit",
      {
        state: { ue },
      }
    );
  }

  // TABLE COLUMNS
  const columns = [

    {
      header: "Code",
      accessor: "code",
      render: (row) => (
        <CBadge
          color="primary"
          shape="rounded-pill"
        >
          {row.code || "-"}
        </CBadge>
      ),
    },

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
      header: "Crédit",
      accessor: "credit",
      render: (row) => (
        <div className="text-center fw-semibold">
          {row.credit || 0}
        </div>
      ),
    },

    {
      header: "CMI",
      accessor: "nombre_heure_cmi",
      render: (row) => (
        <div className="text-center">
          {row.nombre_heure_cmi || 0} h
        </div>
      ),
    },

    {
      header: "TD",
      accessor: "nombre_heure_td",
      render: (row) => (
        <div className="text-center">
          {row.nombre_heure_td || 0} h
        </div>
      ),
    },

    {
      header: "TP",
      accessor: "nombre_heure_tp",
      render: (row) => (
        <div className="text-center">
          {row.nombre_heure_tp || 0} h
        </div>
      ),
    },

    {
      header: "Total",
      accessor: "total",
      render: (row) => {

        const total =
          (Number(row.nombre_heure_cmi) || 0) +
          (Number(row.nombre_heure_td) || 0) +
          (Number(row.nombre_heure_tp) || 0);

        return (
          <div className="fw-bold text-primary text-center">
            {total} h
          </div>
        );
      },
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
              Liste des unités d’enseignement
            </h5>

            <small className="text-medium-emphasis">
              Gestion des unités d’enseignement
            </small>
          </div>

          <CButton
            color="primary"
            onClick={() =>
              navigate(
                "/cotation/unite-enseignement/edit"
              )
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

          ) : ues.length === 0 ? (

            <CAlert color="warning">
              Aucune unité d’enseignement trouvée
            </CAlert>

          ) : (

            <Table
              columns={columns}
              data={ues}
              itemsPerPage={10}
              enableSearch={true}
            />
          )}
        </CCardBody>
      </CCard>
    </div>
  );
}