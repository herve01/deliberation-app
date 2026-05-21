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

import semestreService from "@src/infrastructure/services/cotation/semestreService";
import Table from "@src/views/modules/shared/components/table";
import { useToast } from "@src/app/context/ToastContext";

import "@src/styles/global.css";

export default function SemestreList() {

  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  const [semestres, setSemestres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // LOAD DATA
  async function load() {

    try {

      setLoading(true);

      const data = await semestreService.getAll();

      setSemestres(data || []);
      setError("");

    } catch (e) {

      console.error(e);

      setError(
        "Impossible de charger les semestres"
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
      "Voulez-vous vraiment supprimer ce semestre ?"
    );

    if (!confirmDelete) return;

    try {

      await semestreService.delete(id);

      setSemestres((prev) =>
        prev.filter((s) => s.id !== id)
      );

      showToast(
        "Semestre supprimé avec succès !"
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
  function handleEdit(semestre) {

    navigate(
      "/cotation/semestre/edit",
      {
        state: { semestre },
      }
    );
  }

  // TABLE COLUMNS
  const columns = [
    {
      header: "Intitulé",
      accessor: "semestreName",
      render: (row) => (
        <div className="fw-semibold">
          {row.semestreName}
        </div>
      ),
    },
    {
      header: "Numero",
      accessor: "numero",
      render: (row) => (
        <span>
          {row?.numero || "N/A"}
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
              Liste des semestres
            </h5>

            <small className="text-medium-emphasis">
              Gestion des semestres
            </small>
          </div>

          <CButton
            color="primary"
            onClick={() =>
              navigate(
                "/cotation/semestre/edit"
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

          ) : semestres.length === 0 ? (

            <CAlert color="warning">
              Aucun semestre trouvé
            </CAlert>

          ) : (

            <Table
              columns={columns}
              data={semestres}
              itemsPerPage={7}
              enableSearch={true}
            />
          )}

        </CCardBody>
      </CCard>
    </div>
  );
}