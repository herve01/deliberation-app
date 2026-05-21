import React, { useEffect, useState } from "react";

import {
  useNavigate,
  useLocation,
} from "react-router-dom";

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

import mentionEcueDetailService from "@src/infrastructure/services/cotation/mentionEcueDetailService";

import Table from "@src/views/modules/shared/components/table";

import { useToast } from "@src/app/context/ToastContext";

import "@src/styles/global.css";

export default function MentionEcueDetailList() {

  const navigate = useNavigate();

  const location = useLocation();

  const { showToast } = useToast();

  const [items, setItems] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // LOAD DATA
  async function load() {

    try {

      setLoading(true);

      const data =
        await mentionEcueDetailService.getAll();

      setItems(data || []);

      setError("");

    } catch (e) {

      console.error(e);

      setError(
        "Impossible de charger les données"
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

    const confirmDelete =
      window.confirm(
        "Voulez-vous vraiment supprimer cet élément ?"
      );

    if (!confirmDelete) return;

    try {

      await mentionEcueDetailService.delete(
        id
      );

      setItems((prev) =>
        prev.filter(
          (item) => item.id !== id
        )
      );

      showToast(
        "Suppression effectuée avec succès !"
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
  function handleEdit(item) {

    navigate(
      "/cotation/mention-ecue-details/edit",
      {
        state: {
          mentionEcueDetail: item,
        },
      }
    );
  }

  // TABLE COLUMNS
  const columns = [

    {
      header: "Mention",

      accessor: "mention",

      render: (row) => (

        <div className="fw-semibold">
          {row.mention?.intitule ||
            "-"}
        </div>
      ),
    },

    {
      header: "Semestre",

      accessor: "semestre",

      render: (row) => (

        <CBadge
          color="info"
          shape="rounded-pill"
        >
          {row.semestre?.intitule ||
            "-"}
        </CBadge>
      ),
    },

    {
      header: "ECUE",

      accessor: "ecue",

      render: (row) => (

        <div className="fw-semibold">
          {row.ecue?.intitule || "-"}
        </div>
      ),
    },

    {
      header: "Note annuelle",

      accessor: "noteAnnee",

      render: (row) => (

        <div className="text-center fw-bold">
          {row.noteAnnee || 0}
        </div>
      ),
    },

    {
      header: "Crédit",

      accessor: "credit",

      render: (row) => (

        <div
          className="
            text-center
            fw-bold
            text-primary
          "
        >
          {row.credit || 0}
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

          {/* EDIT */}
          <CButton
            color="warning"
            size="sm"
            variant="outline"
            className="
              d-flex
              align-items-center
              justify-content-center
            "
            onClick={() =>
              handleEdit(row)
            }
          >

            <CIcon
              icon={cilPencil}
            />

          </CButton>

          {/* DELETE */}
          <CButton
            color="danger"
            size="sm"
            variant="outline"
            className="
              d-flex
              align-items-center
              justify-content-center
            "
            onClick={() =>
              handleDelete(row.id)
            }
          >

            <CIcon
              icon={cilTrash}
            />

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

              Liste des ECUE par mention

            </h5>

            <small className="text-medium-emphasis">

              Gestion des ECUE par
              mention et semestre

            </small>

          </div>

          <CButton
            color="primary"
            onClick={() =>
              navigate(
                "/cotation/mention-ecue-details/edit"
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

          ) : items.length === 0 ? (

            <CAlert color="warning">

              Aucun élément trouvé

            </CAlert>

          ) : (

            <Table
              columns={columns}
              data={items}
              itemsPerPage={10}
              enableSearch={true}
            />

          )}

        </CCardBody>

      </CCard>

    </div>
  );
}