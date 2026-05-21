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
  CRow,
  CCol,
} from "@coreui/react";

import {
  cilPlus,
  cilPencil,
  cilTrash,
  cilCalendar,
  cilLayers,
} from "@coreui/icons";

import CIcon from "@coreui/icons-react";

import sessionService from "@src/infrastructure/services/cotation/sessionService";

import { useToast } from "@src/app/context/ToastContext";

import "@src/styles/global.css";

export default function SessionList() {

  const navigate = useNavigate();

  const location = useLocation();

  const { showToast } = useToast();

  const [sessions, setSessions] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // LOAD DATA
  async function load() {

    try {

      setLoading(true);

      const data =
        await sessionService.getAll();

      setSessions(data || []);

      setError("");

    } catch (error) {

      console.error(error);

      setError(
        "Impossible de charger les sessions"
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
        "Voulez-vous vraiment supprimer cette session ?"
      );

    if (!confirmDelete) return;

    try {

      await sessionService.delete(id);

      setSessions((prev) =>
        prev.filter((s) => s.id !== id)
      );

      showToast(
        "Session supprimée avec succès !",
        "success"
      );

    } catch (error) {

      console.error(error);

      showToast(
        "Erreur lors de la suppression",
        "error"
      );
    }
  }

  // EDIT
  function handleEdit(session) {

    navigate(
      "/cotation/session/edit",
      {
        state: { session },
      }
    );
  }

  // GROUP BY SEMESTRE
  const groupedSessions = Object.entries(
    sessions.reduce((acc, session) => {
      const semestre =
        session.semestre?.numero
          ? `Semestre ${session.semestre.numero}`
          : "Sans semestre";

      if (!acc[semestre]) {
        acc[semestre] = [];
      }

      acc[semestre].push(session);

      return acc;
    }, {})
  );

  return (

    <div className="container-fluid px-3">

      <CRow>

        <CCol xs={12}>

          <CCard className="border-1 shadow-sm">

            {/* HEADER */}
            <CCardHeader
              className="
                bg-white
                border-bottom
                py-3
                d-flex
                justify-content-between
                align-items-center
                flex-wrap
                gap-3">

              <div>

                <h5 className="mb-0 fw-bold">
                  Liste des sessions
                </h5>

                <small className="text-medium-emphasis">
                  Gestion des sessions académiques
                </small>

              </div>

              <CButton
                color="primary"
                className="
                  d-flex
                  align-items-center
                "
                onClick={() =>
                  navigate(
                    "/cotation/session/edit"
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

                  <div className="mt-3">
                    Chargement des sessions...
                  </div>

                </div>

              ) : error ? (

                <CAlert color="danger">
                  {error}
                </CAlert>

              ) : sessions.length === 0 ? (

                <CAlert color="warning">

                  Aucune session trouvée

                </CAlert>

              ) : (

                <div className="table-responsive">

                  {groupedSessions.map(
                    ([semestre, items]) => (

                      <div
                        key={semestre}
                        className="mb-5"
                      >

                        {/* TITRE SEMESTRE */}
                        <div
                          className="
                            bg-light
                            border

                            px-3
                            py-3
                            d-flex
                            align-items-center
                            justify-content-between
                          "
                        >

                          <div className="d-flex align-items-center gap-2">

                            <CIcon
                              icon={cilLayers}
                              className="text-primary"
                            />

                            <span className="fw-bold fs-5">
                              {semestre}
                            </span>

                          </div>

                          <CBadge
                            color="primary"
                            shape="rounded-pill"
                          >
                            {items.length} session(s)
                          </CBadge>

                        </div>

                        {/* TABLE */}
                       <table
                         className="
                           table
                           table-hover
                           align-middle
                           mb-0
                           shadow-sm
                         "
                         style={{
                           borderCollapse: "collapse",
                           border: "1px solid #dee2e6",
                         }}
                       >

                          <thead className="table-light">

                            <tr>

                              <th>
                                Session
                              </th>

                              <th width="120">
                                Ordre
                              </th>

                              <th
                                width="150"
                                className="text-end"
                              >
                                Actions
                              </th>

                            </tr>

                          </thead>

                          <tbody>

                            {items.map((row) => (

                              <tr key={row.id}>

                                {/* SESSION */}
                                <td>

                                  <div className="d-flex align-items-center gap-3">

                                    <div
                                      className="
                                        bg-primary
                                        text-white
                                        rounded-circle
                                        d-flex
                                        align-items-center
                                        justify-content-center
                                      "
                                      style={{
                                        width: 45,
                                        height: 45,
                                      }}
                                    >

                                      <CIcon
                                        icon={cilCalendar}
                                      />

                                    </div>

                                    <div>

                                      <div className="fw-semibold">

                                        {row.sessionName}

                                      </div>

                                      <small className="text-medium-emphasis">

                                        Numéro de session

                                      </small>

                                    </div>

                                  </div>

                                </td>

                                {/* ORDRE */}
                                <td>

                                  <CBadge color="primary">

                                    {row.numero}

                                  </CBadge>

                                </td>

                                {/* ACTIONS */}
                                <td>

                                  <div
                                    className="
                                      d-flex
                                      justify-content-end
                                      gap-2
                                    "
                                  >

                                    <CButton
                                      color="warning"
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        handleEdit(row)
                                      }
                                    >

                                      <CIcon
                                        icon={cilPencil}
                                      />

                                    </CButton>

                                    <CButton
                                      color="danger"
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        handleDelete(row.id)
                                      }
                                    >

                                      <CIcon
                                        icon={cilTrash}
                                      />

                                    </CButton>

                                  </div>

                                </td>

                              </tr>
                            ))}

                          </tbody>

                        </table>

                      </div>
                    )
                  )}

                </div>

              )}

            </CCardBody>

          </CCard>

        </CCol>

      </CRow>

    </div>
  );
}