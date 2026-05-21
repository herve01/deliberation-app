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

import userService from "@src/infrastructure/services/setting/userService";
import Table from "@src/views/modules/shared/components/table";
import { useToast } from "@src/app/context/ToastContext";

import "@src/styles/global.css";

export default function UserList() {

  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // LOAD DATA
  async function load() {

    try {

      setLoading(true);

      const data = await userService.getAll();

      setUsers(data || []);
      setError("");

    } catch (e) {

      console.error(e);

      setError(
        "Impossible de charger les utilisateurs"
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
      "Voulez-vous vraiment supprimer cet utilisateur ?"
    );

    if (!confirmDelete) return;

    try {

      await userService.delete(id);

      setUsers((prev) =>
        prev.filter((u) => u.id !== id)
      );

      showToast(
        "Utilisateur supprimé avec succès !"
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
  function handleEdit(user) {

    navigate("/setting/utilisateur/edit", {
      state: { user },
    });
  }

  // ROLE COLOR
  function getRoleColor(role) {

    switch (role) {

      case "ADMINISTRATEUR":
        return "danger";

      case "INSCRIPTION":
        return "primary";

      case "COTATION":
        return "warning";

      case "DELIBERATION":
        return "success";

      default:
        return "secondary";
    }
  }

  // TABLE COLUMNS
  const columns = [
    {
      header: "Nom complet",
      accessor: "nom",
      render: (row) => (
        <div>
          <div className="fw-semibold">
            {row.nom} {row.prenom}
          </div>

          <small className="text-medium-emphasis">
            @{row.username}
          </small>
        </div>
      ),
    },
    {
      header: "Email",
      accessor: "email",
      render: (row) => (
        <span>
          {row.email}
        </span>
      ),
    },
    {
      header: "Rôle",
      accessor: "role",
      render: (row) => (
        <CBadge color={getRoleColor(row.role)}>
          {row.role}
        </CBadge>
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
              Liste des utilisateurs
            </h5>

            <small className="text-medium-emphasis">
              Gestion des comptes utilisateurs
            </small>
          </div>

          <CButton
            color="primary"
            onClick={() =>
              navigate("/setting/utilisateur/edit")
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

          ) : users.length === 0 ? (

            <CAlert color="warning">
              Aucun utilisateur trouvé
            </CAlert>

          ) : (

            <Table
              columns={columns}
              data={users}
              itemsPerPage={7}
              enableSearch={true}
            />
          )}
        </CCardBody>
      </CCard>
    </div>
  );
}