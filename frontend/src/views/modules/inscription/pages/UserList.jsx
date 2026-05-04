// src/views/modules/contact/ContactList.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import userService from "@src/infrastructure/services/userService";
import Table from "@src/views/modules/shared/components/table";
import { useToast } from "@src/ToastContext";

import "@src/styles/global.css";
import { ICON_PATHS } from "@src/assets/icons/paths";

export default function ContactList() {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  // 🔄 LOAD DATA (optimisé avec useCallback)
  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = query
        ? await userService.search(query)
        : await userService.getAll();

      setUsers(data);
    } catch (e) {
      console.error(e);
      setError("Impossible de charger les utilisateurs");
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    load();
  }, [load, location.key]); // location.key 👍 mieux que state

  // 🗑 DELETE
  async function handleDelete(id) {
    if (!window.confirm("Supprimer cet utilisateur ?")) return;

    try {
      await userService.delete(id);
      showToast("Utilisateur supprimé avec succès!");
      setTimeout(() => {
            setUsers((prev) => prev.filter((u) => u.id !== id));
      }, 3000);

    } catch (e) {
      console.error(e);
      alert("Erreur lors de la suppression");
    }
  }

  // ✏️ EDIT
  function handleEdit(user) {
    navigate("/utilisateur/edit", { state: { user } });
  }

  // 📊 TABLE COLUMNS
  const columns = [
    {
      header: "Nom",
      accessor: "nom",
      render: (row) => `${row.nom}`,
    },
    {
      header: "Email",
      accessor: "email",
    },
    {
      header: "Actions",
      accessor: "actions",
      render: (row) => (
       <div className="d-flex gap-1"
       style={{ justifyContent: "flex-end"}}>
           <button
             className="btn btn-sm btn-warning"
             onClick={() => handleEdit(row)}>
                <i className="bi bi-pencil-fill"></i>
           </button>

           <button
             className="btn btn-sm btn-danger"
             onClick={() => handleDelete(row.id)}>
               <i className="bi bi-trash"></i>
           </button>
       </div>
      ),
    },
  ];

  return (
    <div className="container">
      {/* HEADER */}
      <div className="header-actions">
        <button
          className="btn-primary"
          onClick={() => navigate("/utilisateur/edit")}
        >
          + Ajouter utilisateur
        </button>
      </div>

      <hr className="separator" />
      <div style={{ marginBottom: 20 }} />

      {/* CONTENT */}
      {loading ? (
        <p>Chargement...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : users.length === 0 ? (
        <p>Aucun utilisateur trouvé</p>
      ) : (
        <Table
          columns={columns}
          data={users}
          itemsPerPage={7}
          enableSearch={false}
        />
      )}
    </div>
  );
}