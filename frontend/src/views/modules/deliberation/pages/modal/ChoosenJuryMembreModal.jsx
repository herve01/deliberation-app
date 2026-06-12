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
  CBadge,
  CInputGroup,
  CInputGroupText
} from "@coreui/react";

import CIcon from "@coreui/icons-react";
import {
    cilPen,
    cilSearch,
    cilCheck,
    cilCheckCircle,
    cilCursor,
    cilHandPointRight,
    cilPlus } from "@coreui/icons";

export default function ChoosenJuryMembreModal({
  visible,
  setVisible,
  personnels = [],
  alreadyChoosen = [],
  onSubmit
}) {
  const [loading, setLoading] = useState(false);
  const [choosen, setChoosen] = useState(null);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
     if (!visible) return;

     setData(personnels);

   }, [visible, personnels])


const handleChoosen = async (row) => {
  if (loading) return;

  setLoading(true);

  try {
    await onSubmit?.(row);
    setVisible(false);
  } catch (error) {
    console.error(error);
    showToast("Erreur lors de l'opération", "error");
  } finally {
    setLoading(false);
  }
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
      <div>
        {/* HEADER */}
        <CModalHeader
          className="border-1 bg-light"
          style={{
            cursor: "move",
            borderTopLeftRadius: "14px",
            borderTopRightRadius: "14px"
          }}
        >
          <CModalTitle className="fw-bold d-flex align-items-center">
            <CIcon icon={cilPen} className="me-2" />
            Selectionné le membre de jury
          </CModalTitle>

        </CModalHeader>

      <CModalBody
        style={{
            background: "#f4f6fb",
            maxHeight: "80vh",
            overflowY: "auto"
        }}
      >
        <CCard className="border-0 shadow-sm" style={{ borderRadius: "14px" }}>
          <CCardBody>
            <div className="d-flex justify-content-between mb-3">
                <CInputGroup style={{ maxWidth: 350 }}>
                  <CInputGroupText><CIcon icon={cilSearch} /></CInputGroupText>
                  <CFormInput placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)} />
                </CInputGroup>
            </div>
            <div className="px-3 py-2 fw-semibold text-white">
                <CRow>
                      <CCol md={8}>Membre</CCol>
                      <CCol className="text-center" md={4}></CCol>
                </CRow>
            </div>

          {/* LISTE */}
          <CListGroup flush className="shadow-sm">
            {(data ?? []).map((item, index) => {
              const etudiant = item?.etudiant;

              return (
                <CListGroupItem
                  key={item?.id ?? index}
                  className="border-0 border-bottom py-0"
                  style={{
                    background: index % 2 === 0 ? "#fff" : "#f9fafc",
                  }}
                >
                  <CRow className="align-items-center">
                    {/* ETUDIANT */}
                    <CCol md={8} className="d-flex align-items-center py-1 gap-3">
                      <div
                        className="rounded-circle text-white fw-bold d-flex align-items-center justify-content-center shadow-sm"
                        style={{
                          width: 40,
                          height: 40,
                          background: "linear-gradient(135deg,#321fdb,#4f46e5)",
                        }}
                      >
                        {`${item?.prenom?.charAt(0) || ""}${item?.nom?.charAt(0) || ""}`}
                      </div>

                      <div>
                        <div className="fw-semibold text-dark">
                          {[
                            item?.nom?.toUpperCase(),
                            item?.postnom?.toUpperCase(),
                            item?.prenom,
                          ]
                            .filter(Boolean)
                            .join(" ")}
                        </div>
                      </div>
                    </CCol>

                    {/* NOTE */}
                    <CCol md={4}>
                      {/* contenu ici */}
                        <div className="d-flex justify-content-end">
                          <CButton color="primary"
                              size="sm"

                              onClick={() => handleChoosen(item)}
                              >
                            <CIcon icon={cilCheckCircle} className="me-1" />
                              {loading ? "Chargement..." : "Choisir"}
                          </CButton>
                        </div>
                    </CCol>
                  </CRow>
                </CListGroupItem>
              );
            })}
          </CListGroup>
          </CCardBody>
        </CCard>
      </CModalBody>
      </div>

      {/* STYLE */}
      <style>
        {`
            .choose-btn {
              opacity: 0;
              transform: translateX(10px);
              transition: all 0.2s ease;
            }

            .student-item:hover .choose-btn {
              opacity: 1;
              transform: translateX(0);
            }

          .custom-modal .modal-content{
            border:none;
            border-radius:14px;
            overflow:hidden;
            backdrop-filter: blur(10px);
            box-shadow: 0 10px 40px rgba(0,0,0,0.25);
          }

          .custom-modal .modal-dialog{
            max-width:800px;
          }

          .custom-modal .form-control:focus{
            border-color:#321fdb;
            box-shadow: 0 0 0 0.15rem rgba(50,31,219,0.15);
          }

          .custom-modal .list-group-item:hover{
            background:#eef2ff !important;
          }

          @media print {
            .modal-header,
            .btn,
            .modal-footer {
              display: none !important;
            }

            .modal-body {
              overflow: visible !important;
              max-height: none !important;
            }
          }
        `}
      </style>
    </CModal>
  );
}