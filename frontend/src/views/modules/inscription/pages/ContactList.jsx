// src/views/modules/contact/ContactList.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { ICON_PATHS } from "@src/assets/icons/paths";
import contactService from "@src/infrastructure/services/contactService";
import userService from "@src/infrastructure/services/userService";
import Table from "@src/views/modules/shared/components/table";
import { useToast } from "@src/core/context/ToastContext";

import "@src/styles/global.css";

export default function ContactList() {

  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  const [toast, setToast] = useState(null);

  // Refresh
  async function load() {
    try {
      setLoading(true);

      const data = query
        ? await contactService.search(query)
        : await contactService.getAll();

      setContacts(data);

    } catch (e) {
      console.error(e);
      setError("Impossible de charger les contacts");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [query, location.state]);

  // 🗑 DELETE
  async function handleDelete(id) {
    if (!window.confirm("Supprimer ce contact ?")) return;

    await contactService.delete(id);
    showToast("Contact supprimé avec succès!");
    setTimeout(() => {
        setContacts(prev => prev.filter(c => c.id !== id));
    }, 3000);

  }

  // Fonction permettant d'envoyer l'object dans la page editContact
  function handleEdit(contact) {

    console.log('contact', contact);
    navigate("/contact/edit", { state: { contact } });
  }

  const columns = [
    {
      header: "Nom",
      accessor: "nom",
      render: (row) => `${row.nom} ${row.prenom}`,
    },
    {
      header: "Poste",
      accessor: "poste",
    },
    {
      header: "Direction",
      accessor: "direction",
    },
    {
      header: "Bureau",
      accessor: "bureau",
    },
    {
      header: "Téléphone",
      accessor: "telephone",
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
          onClick={() => navigate("/contact/edit")}
        >
          + Ajouter contact
        </button>

      </div>

      <hr className="separator" />
      <div style={{ marginBottom: 20 }} />

      {/* CONTENT */}
      {loading ? (
        <p>Chargement...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : contacts.length === 0 ? (
        <p>Aucun contact trouvé</p>
      ) : (
        <Table
          columns={columns}
          data={contacts}
          itemsPerPage={7}
          enableSearch={false}
        />
      )}

    </div>
  );
}