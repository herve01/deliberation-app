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

import inscriptionService from "@src/infrastructure/services/inscription/inscriptionService";
import Table from "@src/views/modules/shared/components/table";
import { useToast } from "@src/app/context/ToastContext";

import "@src/styles/global.css";

export default function InscriptionList() {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  const [inscriptions, setInscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // LOAD DATA
  async function load() {
    try {
      setLoading(true);

      const data = await inscriptionService.getAll();

      setInscriptions(data || []);
      setError("");

    } catch (e) {
      console.error(e);

      setError(
        "Impossible de charger les inscriptions"
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
      "Voulez-vous vraiment supprimer cette inscription ?"
    );

    if (!confirmDelete) return;

    try {
      await inscriptionService.delete(id);

      setInscriptions((prev) =>
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
  function handleEdit(inscription) {
    navigate("/inscription/list/edit", {
      state: { inscription },
    });
  }

  // TABLE COLUMNS
  const columns = [
    {
      header: "",
      accessor: "photo",
      render: (row) =>
        row?.photo ? (
          <img
            src={row.photo}
            alt="Photo étudiant"
            width={40}
            height={40}
            className="rounded-circle object-fit-cover"
            style={{
              objectFit: "cover",
            }}
          />
        ) : (
          <div
            className="
              rounded-circle
              bg-light
              d-flex
              align-items-center
              justify-content-center
              text-muted
            "
            style={{
              width: 40,
              height: 40,
            }}
          >
           {`${row.etudiant?.prenom?.charAt(0) || ""}${row.etudiant?.nom?.charAt(0) || ""}`}
          </div>
        ),
    },

    {
      header: "Étudiant",
      accessor: "etudiant",
      render: (row) => (
        <div className="fw-semibold">
          {[
            row?.etudiant?.nom,
            row?.etudiant?.postnom,
            row?.etudiant?.prenom,
          ]
            .filter(Boolean)
            .join(" ") || "-"}
        </div>
      ),
    },

    {
      header: "Année Académique",
      accessor: "annee",
      render: (row) => (
        <span>
          {row?.annee?.intitule || "-"}
        </span>
      ),
    },

    {
      header: "Mention",
      accessor: "mention",
      render: (row) => (
        <span>
          {row?.mention?.niveau?.intitule || "-"} {row?.mention?.intitule || "-"}
        </span>
      ),
    },

    {
      header: "Type",
      accessor: "estNouvelle",
      render: (row) => (
        <CBadge
          color={
            row?.estNouvelle
              ? "success"
              : "info"
          }
        >
          {row?.estNouvelle
            ? "Nouvelle inscription"
            : "Réinscription"}
        </CBadge>
      ),
    },

    {
      header: "Date",
      accessor: "date",
      render: (row) => (
        <span>
          {row?.date
            ? new Date(row.date).toLocaleDateString(
                "fr-FR",
                {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                }
              )
            : "-"}
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
              Liste des inscriptions
            </h5>

            <small className="text-medium-emphasis">
              Gestion des inscriptions académiques
            </small>
          </div>

          <CButton
            color="primary"
            onClick={() =>
              navigate("/inscription/list/edit")
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

          ) : inscriptions.length === 0 ? (
            <CAlert color="warning">
              Aucune inscription trouvée
            </CAlert>

          ) : (
            <Table
              columns={columns}
              data={inscriptions}
              itemsPerPage={7}
              enableSearch={true}
            />
          )}
        </CCardBody>
      </CCard>
    </div>
  );
}