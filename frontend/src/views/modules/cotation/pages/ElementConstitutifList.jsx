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

import ecueService from "@src/infrastructure/services/cotation/ecueService";
import Table from "@src/views/modules/shared/components/table";
import { useToast } from "@src/app/context/ToastContext";

import "@src/styles/global.css";

export default function EcueList() {

  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  const [ecues, setEcues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // LOAD DATA
  async function load() {

    try {

      setLoading(true);

      const data =
        await ecueService.getAll();

      setEcues(data || []);
      setError("");

    } catch (e) {

      console.error(e);

      setError(
        "Impossible de charger les ECUE"
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
      "Voulez-vous vraiment supprimer cet ECUE ?"
    );

    if (!confirmDelete) return;

    try {

      await ecueService.delete(id);

      setEcues((prev) =>
        prev.filter((ecue) => ecue.id !== id)
      );

      showToast(
        "ECUE supprimé avec succès !"
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
  function handleEdit(ecue) {

    navigate(
      "/cotation/element-constitutif/edit",
      {
        state: { ecue },
      }
    );
  }

  // TABLE COLUMNS
  const columns = [

    {
      header: "UE",
      accessor: "ueId",
      render: (row) => (
        <CBadge
          color="info"
          shape="rounded-pill"
        >
          {row.ueId || "-"}
        </CBadge>
      ),
    },

    {
      header: "Intitulé",
      accessor: "intitule",
      render: (row) => (
        <div className="fw-semibold">
          {row.intitule || "-"}
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
      accessor: "nombreHeureCmi",
      render: (row) => (
        <div className="text-center">
          {row.nombreHeureCmi || 0} h
        </div>
      ),
    },

    {
      header: "TD",
      accessor: "nombreHeureTd",
      render: (row) => (
        <div className="text-center">
          {row.nombreHeureTd || 0} h
        </div>
      ),
    },

    {
      header: "TP",
      accessor: "nombreHeureTp",
      render: (row) => (
        <div className="text-center">
          {row.nombreHeureTp || 0} h
        </div>
      ),
    },

    {
      header: "Total",
      accessor: "total",
      render: (row) => {

        const total =
          (Number(row.nombreHeureCmi) || 0) +
          (Number(row.nombreHeureTd) || 0) +
          (Number(row.nombreHeureTp) || 0);

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
              Liste des ECUE
            </h5>

            <small className="text-medium-emphasis">
              Gestion des éléments constitutifs d’UE
            </small>
          </div>

          <CButton
            color="primary"
            onClick={() =>
              navigate("/cotation/element-constitutif/edit")
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

          ) : ecues.length === 0 ? (

            <CAlert color="warning">
              Aucun ECUE trouvé
            </CAlert>

          ) : (

            <Table
              columns={columns}
              data={ecues}
              itemsPerPage={10}
              enableSearch={true}
            />
          )}
        </CCardBody>
      </CCard>
    </div>
  );
}