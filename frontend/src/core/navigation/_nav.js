import "bootstrap-icons/font/bootstrap-icons.css";

const navigation = [
  {
    name: "Inscription",
    icon: "bi bi-journal-text",
    children: [
      {
        name: "Tableau de bord",
        to: "/inscription/dashboard",
        icon: "bi bi-speedometer2",
      },
      {
        name: "Inscription",
        to: "/inscription/list",
        icon: "bi bi-list",
      },
      {
        name: "Réinscription",
        to: "inscription/reinscription",
        icon: "bi bi-arrow-repeat",
      },
      {
        name: "Année académique",
        to: "/inscription/annee-academique",
        icon: "bi bi-calendar-event",
      },
      {
        name: "Mention",
        to: "/inscription/mention",
        icon: "bi bi-award",
      },
      {
        name: "Niveau",
        to: "/inscription/niveau",
        icon: "bi bi-bar-chart",
      },
      {
        name: "Cycle",
        to: "/inscription/cycle",
         icon: "bi bi-layers",
      },
      {
        name: "Filière",
        to: "/inscription/filiere",
        icon: "bi bi-mortarboard",
      },
    {
      name: "Domaine",
      to: "/inscription/domaine",
      icon: "bi bi-diagram-3",
    },
    ],
  },
      { divider: true },
  {
    name: "Cotation",
    icon: "bi bi-calculator",
    children: [
      {
        name: "Tableau de bord",
        to: "/cotation/dashboard",
        icon: "bi bi-speedometer2",
      },
    {
      name: "Cotation",
      to: "/cotation/list",
      icon: "bi bi-clipboard-check",
    },

      {
        name: "Unités d’enseignement",
        to: "/cotation/unite-enseignement",
        icon: "bi bi-book",
      },
      {
        name: "Éléments constitutifs",
        to: "/cotation/element-constitutif",
        icon: "bi bi-journal",
      },
      {
        name: "Semestre",
        to: "/cotation/semestre",
        icon: "bi bi-calendar3",
      },
      {
        name: "Session",
        to: "/cotation/session",
        icon: "bi bi-clock-history",
      },

      {
        name: "Confirmation ECUE",
        to: "/cotation/mention-ecue-details",
        icon: "bi bi-check2-square",
      },
    ],
  },
  { divider: true },
  {
    name: "Délibération",
    icon: "bi bi-people",
    children: [
      {
        name: "Tableau de bord",
        to: "/deliberation/dashboard",
        icon: "bi bi-speedometer2",
      },

      {
        name: "Membres du jury",
        to: "/jury-membres",
        icon: "bi bi-person-badge",
      },
      {
        name: "Jury par mention",
        to: "/jury-mention",
        icon: "bi bi-diagram-2",
      },
      {
        name: "Délibération",
        to: "/deliberation/list",
        icon: "bi bi-clipboard-data",
      },

    {
      name: "Délibération Traitement",
      to: "/deliberation/traitement",
      icon: "bi bi-clipboard-data",
    },

    ],
  },
   { divider: true },
  {
    name: "Paramètres",
    icon: "bi bi-gear",
    children: [
      {
        name: "Utilisateurs",
        to: "/setting/utilisateur",
        icon: "bi bi-people-fill",
      },
    ],
  },
];

export default navigation;