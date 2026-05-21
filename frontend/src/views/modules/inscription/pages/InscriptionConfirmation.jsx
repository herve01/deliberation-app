import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import mentionService from "@src/infrastructure/services/inscription/mentionService";
import Table from "@src/views/modules/shared/components/table";
import { useToast } from "@src/app/context/ToastContext";

import "@src/styles/global.css";

export default function MentionList() {

  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  const [mentions, setMentions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // LOAD
  async function load() {
    try {
      setLoading(true);
      const data = await mentionService.getAll();
      setMentions(data);
    } catch (e) {
      console.error(e);
      setError("Impossible de charger les filières");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [location.state]);

  // 🗑 DELETE
  async function handleDelete(id) {
    if (!window.confirm("Supprimer cette filière ?")) return;

    try {
      await mentionService.delete(id);
      showToast("Mention supprimée avec succès!");

      // update immédiat
      setMentions(prev => prev.filter(f => f.id !== id));

    } catch (e) {
      console.error(e);
      showToast("Erreur lors de la suppression", "error");
    }
  }

  //  EDIT
  function handleEdit(mention) {
    navigate("/inscription/mention/edit", { state: { mention } }); // ✅ corrigé
  }

  const columns = [
    {
      header: "Intitulé",
      accessor: "intitule",
    },
    {
        header: "Description",
        accessor: "description",
        render: (row) => `${row.niveau.intitule} ${row.filiere.intitule}`,
    },
    {
      header: "Actions",
      accessor: "actions",
      render: (row) => (
        <div
          className="d-flex gap-2"
          style={{ justifyContent: "flex-end" }}
        >
          <button
            className="btn btn-sm btn-warning"
            onClick={() => handleEdit(row)}
          >
            <i className="bi bi-pencil-fill"></i>
          </button>

          <button
            className="btn btn-sm btn-danger"
            onClick={() => handleDelete(row.id)}
          >
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
          onClick={() => navigate("/inscription/mention/edit")}
        >
          + Ajouter filière
        </button>
      </div>

      <hr className="separator" />
      <div style={{ marginBottom: 20 }} />

      {/* CONTENT */}
      {loading ? (
        <p>Chargement...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : mentions.length === 0 ? (   //  corrigé
        <p>Aucune filière trouvée</p>
      ) : (
        <Table
          columns={columns}
          data={mentions}
          itemsPerPage={7}
          enableSearch={false}
        />
      )}
    </div>
  );
}