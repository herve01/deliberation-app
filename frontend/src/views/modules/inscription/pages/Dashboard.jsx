import React, { useEffect, useState } from "react";
import contactService from "@src/infrastructure/services/contactService";
import userService from "@src/infrastructure/services/userService";

const Dashboard = () => {
  const [stats, setStats] = useState({
    contacts: 0,
    contactsToday: 0,
    contactsMonth: 0,
    contactsYear: 0,
    users: 0,
  });

  const [recentContacts, setRecentContacts] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const contacts = await contactService.getAll();
        const users = await userService.getAll();

        const now = new Date();

        const today = now.toDateString();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        // Calculs corrigés
        const contactsToday = contacts.filter(
          (c) =>
            c.createdAt &&
            new Date(c.createdAt).toDateString() === today
        ).length;

        const contactsMonth = contacts.filter((c) => {
          if (!c.createdAt) return false;
          const d = new Date(c.createdAt);
          return (
            d.getMonth() === currentMonth &&
            d.getFullYear() === currentYear
          );
        }).length;

        const contactsYear = contacts.filter(
          (c) =>
            c.createdAt &&
            new Date(c.createdAt).getFullYear() === currentYear
        ).length;

        // Stats complètes
        setStats({
          contacts: contacts.length,
          contactsToday,
          contactsMonth,
          contactsYear,
          users: users.length,
        });

        // Trier sans bug si createdAt absent
        const sorted = [...contacts].sort((a, b) => {
          if (!a.createdAt) return 1;
          if (!b.createdAt) return -1;
          return new Date(b.createdAt) - new Date(a.createdAt);
        });

        setRecentContacts(sorted.slice(0, 5));
      } catch (e) {
        console.error(e);
      }
    };

    load();
  }, []);

  return (
    <div className="container-fluid">

      {/* Stats */}
      <div className="row g-3 mb-4">

        <div className="col-md-3">
          <div className="card shadow-sm p-3 d-flex flex-row align-items-center justify-content-between">
            <div>
              <h6>Contacts</h6>
              <h3>{stats.contacts}</h3>
            </div>
            <i className="bi bi-people fs-2 text-primary"></i>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm p-3 d-flex flex-row align-items-center justify-content-between">
            <div>
              <h6>Aujourd’hui</h6>
              <h3>{recentContacts.length}</h3>
            </div>
            <i className="bi bi-calendar-day fs-2 text-success"></i>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm p-3 d-flex flex-row align-items-center justify-content-between">
            <div>
              <h6>Ce mois</h6>
              <h3>{stats.contactsMonth}</h3>
            </div>
            <i className="bi bi-calendar-month fs-2 text-warning"></i>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm p-3 d-flex flex-row align-items-center justify-content-between">
            <div>
              <h6>Cette année</h6>
              <h3>{stats.contactsYear}</h3>
            </div>
            <i className="bi bi-calendar fs-2 text-danger"></i>
          </div>
        </div>

      </div>

      {/* Contacts récents */}
      <div className="card shadow-sm p-3">
        <h6 className="mb-3 d-flex justify-content-between align-items-center">
          Contacts récents
          <span className="badge bg-primary">
            {recentContacts.length}
          </span>
        </h6>

        <ul className="list-group table-custom small">
          {recentContacts.map((c) => (
            <li key={c.id} className="list-group-item">
              {c.nom} - {c.telephone}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;