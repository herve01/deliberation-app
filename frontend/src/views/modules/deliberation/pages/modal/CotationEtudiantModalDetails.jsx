import { useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";

import {
  CButton,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CCard,
  CCardBody,

} from "@coreui/react";


import CIcon from "@coreui/icons-react";
import { cilPen, cilPrint } from "@coreui/icons";

import ProfilEtudiant from "@src/views/modules/deliberation/pages/ProfilEtudiant";

import { useToast } from "@src/app/context/ToastContext";

export default function CotationEtudiantModalDetails({
  visible,
  setVisible,
  deliberation = {},
  param = {},
  onSubmit
}) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const printRef = useRef(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Profil_${deliberation?.inscription?.etudiant?.prenom ?? "Etudiant"}`,

  });

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
            Détails des notes d'étudiant
          </CModalTitle>

        </CModalHeader>

      <CModalBody
        style={{
          background: "#f4f6fb",
        }}
      >
        <div className="d-flex justify-content-end mb-3">
          <CButton color="primary" size="sm" onClick={handlePrint}>
            <CIcon icon={cilPrint} className="me-2" />
            Imprimer
          </CButton>
        </div>

        <CCard className="border-0 shadow-sm">
          <CCardBody
            style={{
              maxHeight: "75vh",
              overflowY: "auto",
            }}
          >
            <div ref={printRef}>
              <ProfilEtudiant
                data={deliberation}
                param={param}
              />
            </div>
          </CCardBody>
        </CCard>
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
            box-shadow: 0 10px 40px rgba(0,0,0,0.25);
          }

          .custom-modal .modal-dialog{
            max-width:1100px;
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