import React from "react";

import {
  Link,
  useLocation,
} from "react-router-dom";

import {
  CHeader,
  CContainer,
  CHeaderNav,
  CButton,
  CBreadcrumb,
  CBreadcrumbItem,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CAvatar,
  CBadge,
} from "@coreui/react";

import CIcon from "@coreui/icons-react";

import {
  cilMenu,
  cilBell,
  cilUser,
  cilSettings,
  cilLockLocked,
  cilAccountLogout,
  cilMoon,
} from "@coreui/icons";

import { useAuth } from "@src/app/context/AuthContext";

const AppHeader = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();

  const location = useLocation();

  const pathnames = location.pathname
    .split("/")
    .filter(Boolean);

  // LABELS
  const labels = {
    dashboard: "Dashboard",
    inscription: "Inscription",
    cotation: "Cotation",
    deliberation: "Délibération",
    users: "Utilisateur",
    mention: "Mention",
    domaine: "Domaine",
    niveau: "Niveau",
    filiere: "Filière",
    "annee-academique":
      "Année académique",
  };

  const formatLabel = (value) => {
    return (
      labels[value] ||
      value
        .replace(/-/g, " ")
        .replace(/\b\w/g, (l) =>
          l.toUpperCase()
        )
    );
  };

  // COMMON BUTTON STYLE
  const actionButtonStyle = {
    width: 42,
    height: 42,
    background: "rgba(255,255,255,0.08)",
    border:
      "1px solid rgba(255,255,255,0.12)",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  // ICON STYLE
  const iconStyle = {
    color: "#ffffff",
    fill: "#ffffff",
  };

  return (
    <>
      {/* FIX SVG ICON COLOR */}
      <style>
        {`
          svg {
            fill: currentColor;
          }
        `}
      </style>

      <CHeader
        position="sticky"
        className="px-4 shadow-sm"
        style={{
          height: 70,
          zIndex: 1030,
          background:
            "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
          borderBottom:
            "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(10px)",
        }}
      >
        <CContainer
          fluid
          className="d-flex justify-content-between align-items-center h-100"
        >

          {/* LEFT */}
          <div className="d-flex align-items-center gap-4">

            {/* SIDEBAR TOGGLE */}
            <CButton
              variant="ghost"
              className="rounded-3"
              style={actionButtonStyle}
              onClick={toggleSidebar}
            >
              <CIcon
                icon={cilMenu}
                size="lg"
                style={iconStyle}
              />
            </CButton>

            {/* PAGE TITLE + BREADCRUMB */}
            <div>

              {/* TITLE */}
              <div className="fw-bold fs-5 text-white">
                {formatLabel(
                  pathnames[
                    pathnames.length - 1
                  ] || "dashboard"
                )}
              </div>

              {/* BREADCRUMB */}
              <CBreadcrumb
                className="mb-0 small"
                style={{
                  "--cui-breadcrumb-divider-color":
                    "rgba(255,255,255,0.4)",
                }}
              >

                <CBreadcrumbItem>
                  <Link
                    to="/"
                    className="text-decoration-none text-light opacity-75"
                  >
                    Accueil
                  </Link>
                </CBreadcrumbItem>

                {pathnames.map(
                  (value, index) => {
                    const to =
                      "/" +
                      pathnames
                        .slice(0, index + 1)
                        .join("/");

                    const isLast =
                      index ===
                      pathnames.length - 1;

                    return (
                      <CBreadcrumbItem
                        key={to}
                        active={isLast}
                        style={{
                          color: isLast
                            ? "#ffffff"
                            : "rgba(255,255,255,0.7)",
                        }}
                      >
                        {isLast ? (
                          formatLabel(value)
                        ) : (
                          <Link
                            to={to}
                            className="text-decoration-none text-light opacity-75"
                          >
                            {formatLabel(
                              value
                            )}
                          </Link>
                        )}
                      </CBreadcrumbItem>
                    );
                  }
                )}

              </CBreadcrumb>

            </div>

          </div>

          {/* RIGHT */}
          <CHeaderNav className="d-flex align-items-center gap-3">

            {/* DARK MODE */}
            <CButton
              variant="ghost"
              className="rounded-circle"
              style={actionButtonStyle}
            >
              <CIcon
                icon={cilMoon}
                style={iconStyle}
              />
            </CButton>

            {/* NOTIFICATIONS */}
            <div className="position-relative">

              <CButton
                variant="ghost"
                className="rounded-circle"
                style={actionButtonStyle}
              >
                <CIcon
                  icon={cilBell}
                  style={iconStyle}
                />
              </CButton>

              <CBadge
                color="danger"
                position="top-end"
                shape="rounded-pill"
              >
                3
              </CBadge>

            </div>

            {/* USER MENU */}
            <CDropdown alignment="end">

              <CDropdownToggle
                caret={false}
                className="bg-transparent border-0 shadow-none p-0"
              >
                <div className="d-flex align-items-center gap-3">

                  {/* USER INFO */}
                  <div className="text-end d-none d-md-block">

                    <div className="fw-semibold small text-white">
                      {user?.nom ||
                        "Administrateur"}
                    </div>

                    <div
                      className="text-white-50"
                      style={{
                        fontSize: 12,
                      }}
                    >
                      Super Admin
                    </div>

                  </div>

                  {/* AVATAR */}
                  <CAvatar
                    color="info"
                    textColor="white"
                    size="md"
                    style={{
                      fontWeight: 700,
                    }}
                  >
                    {user?.nom
                      ?.charAt(0)
                      ?.toUpperCase() ||
                      "A"}
                  </CAvatar>

                </div>
              </CDropdownToggle>

              {/* DROPDOWN */}
              <CDropdownMenu className="border-0 shadow rounded-4 overflow-hidden">

                {/* HEADER */}
                <div className="px-4 py-3 bg-light border-bottom">

                  <div className="fw-bold">
                    {user?.nom ||
                      "Administrateur"}
                  </div>

                  <small className="text-medium-emphasis">
                    administrateur@system.cd
                  </small>

                </div>

                {/* ITEMS */}
                <CDropdownItem className="py-2">
                  <CIcon
                    icon={cilUser}
                    className="me-2"
                  />
                  Mon profil
                </CDropdownItem>

                <CDropdownItem className="py-2">
                  <CIcon
                    icon={cilSettings}
                    className="me-2"
                  />
                  Paramètres
                </CDropdownItem>

                <CDropdownItem className="py-2">
                  <CIcon
                    icon={cilLockLocked}
                    className="me-2"
                  />
                  Modifier le mot de passe
                </CDropdownItem>

                <CDropdownItem
                  className="py-2 text-danger border-top"
                  onClick={logout}
                >
                  <CIcon
                    icon={cilAccountLogout}
                    className="me-2"
                  />
                  Déconnexion
                </CDropdownItem>

              </CDropdownMenu>

            </CDropdown>

          </CHeaderNav>

        </CContainer>
      </CHeader>
    </>
  );
};

export default AppHeader;