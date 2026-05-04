import React from 'react';

// Lazy loading
const Dashboard = React.lazy(() => import('./views/modules/pages/Dashboard'));
const UserList = React.lazy(() => import('./views/modules/pages/UserList'));
const ContactList = React.lazy(() => import('./views/modules/pages/ContactList'));
const EditContact = React.lazy(() => import('./views/modules/pages/EditContact'))
const EditUser = React.lazy(() => import('./views/modules/pages/EditUser'))

const routes = [
  { path: '/login', name: 'Home' },
  { path: '/dashboard', element: <Dashboard /> },
  { path: '/utilisateur', element: <UserList /> },
  { path: '/contact', element: <ContactList /> },

  { path: '/contact/edit', element: <EditContact /> },
  { path: '/utilisateur/edit', element: <EditUser /> },
];

export default routes;