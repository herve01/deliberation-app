import React, { useEffect, useState, useRef } from "react";

import {
  CButton,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CListGroup,
  CListGroupItem,
  CRow,
  CCol,
  CFormInput,
  CSpinner,
  CCard,
  CCardBody,
  CBadge
} from "@coreui/react";

import CIcon from "@coreui/icons-react";
import {
  cilPen,
  cilSave,
  cilX,
  cilUser
} from "@coreui/icons";

import Draggable from "react-draggable";

export default function EditNoteModal({
  visible,
  setVisible,
  session = {},
  row = {},
  inscriptions = [],
  onSubmit
}) {

  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState({});

  const dragRef = useRef(null);

  useEffect(() => {
    if (!visible) return;

    const init = {};

    inscriptions.forEach((i) => {
      init[i.etudiant.id] = i.etudiant.note ?? "";
    });

    setNotes(init);

  }, [visible, inscriptions]);

  const handleChange = (id, value) => {

    if (value > 20) value = 20;
    if (value < 0) value = 0;

    setNotes((prev) => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSave = () => {

    const payload = inscriptions.map((i) => ({
      id: i.etudiant.id,
      note: notes[i.etudiant.id]
    }));

    onSubmit?.(payload);

    setVisible(false);
  };

  return (
    <CModal
      visible={visible}
      size="xl"
      alignment="center"
      backdrop="static"
      onClose={() => setVisible(false)}
      className="custom-modal"
    >

        <div >

          {/* HEADER */}
          <CModalHeader
            className="
              border-1
              bg-light
            "
            style={{
              cursor: "move",

              borderTopLeftRadius: "14px",
              borderTopRightRadius: "14px"
            }}
          >

            <CModalTitle className="fw-bold d-flex align-items-center">
              <CIcon
                icon={cilPen}
                className="me-2"
              />
              Saisie des notes
            </CModalTitle>

          </CModalHeader>

          <CModalBody
            style={{
              background: "#f4f6fb",
              maxHeight: "80vh",
              overflowY: "auto"
            }}
          >

            {/* INFOS */}
            <CCard
              className="
                border-0
                shadow-sm
                mb-4
              "
              style={{
                borderRadius: "14px"
              }}
            >
              <CCardBody>

                <CRow className="g-2">

                  <CCol md={9}>
                    <div className="text-medium-emphasis small">
                      Periode
                    </div>

                    <div className="fw-semibold">
                       {session?.sessionName ?? "-"} | {session?.semestre?.semestreName ?? "-"} | {row?.annee?.annee ?? "-"}
                    </div>
                  </CCol>

                  <CCol md={3}>
                    <div className="text-medium-emphasis small">
                      Mention
                    </div>

                    <div className="fw-semibold">
                      {row?.mention?.mentionName ?? "-"}
                    </div>
                  </CCol>

                  <CCol md={12} className="text-center">
                    <CBadge
                      color="primary"
                      shape="rounded-pill"
                          className="px-4 py-2 mt-2 fs-6 d-inline-block"
                      >

                      <div className="fw-semibold">
                           {row?.ecueName ?? "-"}
                      </div>
                    </CBadge>
                  </CCol>

                </CRow>

              </CCardBody>
            </CCard>

            {loading ? (

              <div className="text-center p-5">
                <CSpinner color="primary" />
              </div>

            ) : (

              <>
                {/* HEADER TABLE */}
                <div
                  className="
                    px-3
                    py-2
                    rounded-top
                    fw-semibold
                    text-white
                  "
                  style={{
                    background:
                      "linear-gradient(135deg,#321fdb,#4f46e5)"
                  }}
                >

                  <CRow>
                    <CCol md={8}>
                      Étudiant
                    </CCol>
                    <CCol className="text-center" md={4}>
                      Note /20
                    </CCol>
                  </CRow>

                </div>

                {/* LISTE */}
                <CListGroup
                  flush
                  className="shadow-sm"
                >

                  {inscriptions.map((i, index) => (

                    <CListGroupItem
                      key={i.etudiant.id}
                      className="
                        border-0
                        border-bottom
                        py-0
                      "
                      style={{
                        background:
                          index % 2 === 0
                            ? "#fff"
                            : "#f9fafc"
                      }}
                    >

                      <CRow className="align-items-center">

                        {/* ETUDIANT */}
                        <CCol
                          md={8}
                          className="
                            d-flex
                            align-items-center
                            gap-3
                          "
                        >

                          {i?.photo ? (

                            <img
                              src={i.photo}
                              alt="Photo étudiant"
                              width={40}
                              height={40}
                              className="
                                rounded-circle
                                border
                                shadow-sm
                              "
                              style={{
                                objectFit: "cover"
                              }}
                            />

                          ) : (

                            <div
                              className="
                                rounded-circle
                                text-white
                                fw-bold
                                d-flex
                                align-items-center
                                justify-content-center
                                shadow-sm
                              "
                              style={{
                                width: 40,
                                height: 40,
                                minWidth: 40,
                                background:
                                  "linear-gradient(135deg,#321fdb,#4f46e5)"
                              }}
                            >

                              {`${i?.etudiant?.prenom?.charAt(0) || ""
                                }${i?.etudiant?.nom?.charAt(0) || ""
                                }`}
                            </div>

                          )}

                          <div>

                            <div className="fw-semibold text-dark">
                              {[
                                i?.etudiant?.nom?.toUpperCase(),
                                i?.etudiant?.postnom?.toUpperCase(),
                                i?.etudiant?.prenom
                              ]
                                .filter(Boolean)
                                .join(" ")}
                            </div>

                            <small className="text-medium-emphasis">
                              Matricule :
                              {" "}
                              {i?.etudiant?.matricule || "-"}
                            </small>

                          </div>

                        </CCol>

                        {/* NOTE */}
                        <CCol md={4}>

                          <CFormInput
                            type="number"
                            min={0}
                            max={20}
                            step="0.01"
                            placeholder="0 - 20"
                            value={notes[i.etudiant.id] || ""}
                            onChange={(e2) =>
                              handleChange(
                                i.etudiant.id,
                                e2.target.value
                              )
                            }
                            className="shadow-none text-center"
                            style={{
                              height: "35px",
                              borderRadius: "20px",
                              fontWeight: "600"
                            }}
                          />

                        </CCol>

                      </CRow>

                    </CListGroupItem>

                  ))}

                </CListGroup>

                {/* FOOTER */}
                <div
                  className="
                    d-flex
                    justify-content-end
                    gap-2
                    mt-4
                    pt-3
                    border-top
                    sticky-bottom
                  "
                  style={{
                    background: "#f4f6fb"
                  }}
                >

                  <CButton
                    color="light"
                    onClick={() => setVisible(false)}
                    className="px-4"
                  >
                    Fermer
                  </CButton>

                  <CButton
                    color="primary"
                    onClick={handleSave}
                    className="px-4 shadow-sm"
                  >

                    <CIcon
                      icon={cilSave}
                      className="me-2"
                    />

                    Enregistrer

                  </CButton>

                </div>

              </>
            )}

          </CModalBody>

        </div>

      {/* STYLE */}
      <style>
        {`
          .custom-modal .modal-content{
            border:none;
            border-radius:14px;
            overflow:hidden;
            backdrop-filter: blur(10px);
            box-shadow:
              0 10px 40px rgba(0,0,0,0.25);
          }

          .custom-modal .modal-dialog{
            max-width:1100px;
          }

          .custom-modal .form-control:focus{
            border-color:#321fdb;
            box-shadow:
              0 0 0 0.15rem rgba(50,31,219,0.15);
          }

          .custom-modal .list-group-item{
            transition:all .2s ease;
          }

          .custom-modal .list-group-item:hover{
            background:#eef2ff !important;
          }
        `}
      </style>

    </CModal>
  );
}