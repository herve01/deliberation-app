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

import domaineService from "@src/infrastructure/services/inscription/domaineService";
import Table from "@src/views/modules/shared/components/table";
import { useToast } from "@src/app/context/ToastContext";

import "@src/styles/global.css";

export default function DomaineList() {

  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  const [domaines, setDomaines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // LOAD DATA
  async function load() {

    try {

      setLoading(true);

      const data = await domaineService.getAll();

      setDomaines(data || []);
      setError("");

    } catch (e) {

      console.error(e);

      setError(
        "Impossible de charger les domaines"
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
      "Voulez-vous vraiment supprimer ce domaine ?"
    );

    if (!confirmDelete) return;

    try {

      await domaineService.delete(id);

      setDomaines((prev) =>
        prev.filter((d) => d.id !== id)
      );

      showToast(
        "Domaine supprimé avec succès !"
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
  function handleEdit(domaine) {

    navigate("/inscription/domaine/edit", {
      state: { domaine },
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
              Liste des domaines
            </h5>

            <small className="text-medium-emphasis">
              Gestion des domaines académiques
            </small>
          </div>

          <CButton
            color="primary"
            onClick={() =>
              navigate("/inscription/domaine/edit")
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

          ) : domaines.length === 0 ? (

            <CAlert color="warning">
              Aucun domaine trouvé
            </CAlert>

          ) : (

            <Table
              columns={columns}
              data={domaines}
              itemsPerPage={7}
              enableSearch={true}
            />
          )}
        </CCardBody>
      </CCard>
    </div>
  );
}