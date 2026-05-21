import React from 'react';

// Lazy loading
const DashBoard = React.lazy(() => import('@src/views/modules/inscription/pages/DashBoard'));
const NiveauList = React.lazy(() => import('@src/views/modules/inscription/pages/NiveauList'));
const DomaineList = React.lazy(() => import('@src/views/modules/inscription/pages/DomaineList'));
const CycleList = React.lazy(() => import('@src/views/modules/inscription/pages/CycleList'));
const FiliereList = React.lazy(() => import('@src/views/modules/inscription/pages/FiliereList'));
const MentionList = React.lazy(() => import('@src/views/modules/inscription/pages/MentionList'));
const AnneeList = React.lazy(() => import('@src/views/modules/inscription/pages/AnneeList'));
const InscriptionList = React.lazy(() => import('@src/views/modules/inscription/pages/InscriptionList'));
const InscriptionConfirmation = React.lazy(() => import('@src/views/modules/inscription/pages/InscriptionConfirmation'));
const UserList = React.lazy(() => import('@src/views/modules/login/pages/UserList'));
const Reinscription = React.lazy(() => import('@src/views/modules/inscription/pages/Reinscription'));

const EditNiveau = React.lazy(() => import('@src/views/modules/inscription/pages/EditNiveau'));
const EditDomaine = React.lazy(() => import('@src/views/modules/inscription/pages/EditDomaine'));
const EditCycle = React.lazy(() => import('@src/views/modules/inscription/pages/EditCycle'));
const EditFiliere = React.lazy(() => import('@src/views/modules/inscription/pages/EditFiliere'));
const EditMention = React.lazy(() => import('@src/views/modules/inscription/pages/EditMention'));
const EditAnnee = React.lazy(() => import('@src/views/modules/inscription/pages/EditAnnee'));
const EditInscription = React.lazy(() => import('@src/views/modules/inscription/pages/EditInscription'));
const EditUser = React.lazy(() => import('@src/views/modules/login/pages/EditUser'));

const CotationList = React.lazy(() => import('@src/views/modules/cotation/pages/CotationList'));
const DashBoard_COTATION = React.lazy(() => import('@src/views/modules/cotation/pages/DashBoard'));
const SemestreList = React.lazy(() => import('@src/views/modules/cotation/pages/SemestreList'));
const SessionList = React.lazy(() => import('@src/views/modules/cotation/pages/SessionList'));
const UniteEnseignementList = React.lazy(() => import('@src/views/modules/cotation/pages/UniteEnseignementList'));
const ElementConstitutifList = React.lazy(() => import('@src/views/modules/cotation/pages/ElementConstitutifList'));
const MentionEcueDetailList = React.lazy(() => import('@src/views/modules/cotation/pages/MentionEcueDetailList'));

const EditSemestre = React.lazy(() => import('@src/views/modules/cotation/pages/EditSemestre'));
const EditSession = React.lazy(() => import('@src/views/modules/cotation/pages/EditSession'));
const EditUniteEnseignement = React.lazy(() => import('@src/views/modules/cotation/pages/EditUniteEnseignement'));
const EditElementConstitutif = React.lazy(() => import('@src/views/modules/cotation/pages/EditElementConstitutif'));
const EditMentionEcueDetail = React.lazy(() => import('@src/views/modules/cotation/pages/EditMentionEcueDetail'));

const routes = [
  { path: '/login', name: 'Home' },
  { path: '/utilisateur', element: <UserList /> },
  { path: '/setting/utilisateur', element: <UserList /> },
  { path: '/setting/utilisateur/edit', element: <EditUser /> },

  // ================= MODULE INSCRIPTION =================

  { path: '/inscription/dashboard', element: <DashBoard /> },
  { path: '/inscription/niveau', element: <NiveauList /> },
  { path: '/inscription/domaine', element: <DomaineList /> },
  { path: '/inscription/cycle', element: <CycleList /> },
  { path: '/inscription/filiere', element: <FiliereList /> },
  { path: '/inscription/reinscription', element: <Reinscription /> },
  { path: '/inscription/mention', element: <MentionList /> },
  { path: '/inscription/annee-academique', element: <AnneeList /> },
  { path: '/inscription/list', element: <InscriptionList /> },

  { path: '/inscription/niveau/edit', element: <EditNiveau /> },
  { path: '/inscription/domaine/edit', element: <EditDomaine /> },
  { path: '/inscription/cycle/edit', element: <EditCycle /> },
  { path: '/inscription/filiere/edit', element: <EditFiliere /> },
  { path: '/inscription/mention/edit', element: <EditMention /> },
  { path: '/inscription/annee-academique/edit', element: <EditAnnee /> },
  { path: '/inscription/list/edit', element: <EditInscription /> },
  { path: '/inscription/edit/confirmation', element: <InscriptionConfirmation /> },

  // ================= FIN MODULE INSCRIPTION =================

  // ================= MODULE COTATION =================

  { path: '/cotation/list', element: <CotationList /> },
  { path: '/cotation/dashboard', element: <DashBoard_COTATION /> },
  { path: '/cotation/semestre', element: <SemestreList /> },
  { path: '/cotation/session', element: <SessionList /> },
  { path: '/cotation/unite-enseignement', element: <UniteEnseignementList /> },
  { path: '/cotation/element-constitutif', element: <ElementConstitutifList /> },
  { path: '/cotation/mention-ecue-details', element: <MentionEcueDetailList /> },

  { path: '/cotation/semestre/edit', element: <EditSemestre /> },
  { path: '/cotation/session/edit', element: <EditSession /> },
  { path: '/cotation/unite-enseignement/edit', element: <EditUniteEnseignement /> },
  { path: '/cotation/element-constitutif/edit', element: <EditElementConstitutif /> },
  { path: '/cotation/mention-ecue-details/edit', element: <EditMentionEcueDetail /> },

  // ================= FIN MODULE COTATION =================
];

export default routes;