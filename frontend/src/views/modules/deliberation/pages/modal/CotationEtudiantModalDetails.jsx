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
import { cilPen, cilSave } from "@coreui/icons";

import { useToast } from "@src/app/context/ToastContext";

export default function CotationEtudiantsModal({
  visible,
  setVisible,
  cotationService,
  cotation = {},
  inscriptions = [],
  session = {},
  param = {},
  row = {},
  onSubmit
}) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({ details: [] });

  const [saved, setSaved] = useState({
      mentionSemestreEcueId:'',
      estCote: false,
      countEtudiantWithCote : 0,
      countManqueCote:0
      })

  // =========================
  // GET note
  // =========================
  const getcote = (inscriptionId) =>
    data?.details?.find((d) => d.inscriptionId === inscriptionId)?.note ?? "";

  // =========================
  // LOAD DATA
  // =========================
  useEffect(() => {
    if (!visible) return;

    const init = {
      cotation: {
        id: cotation?.id ?? "",
        mentionId: param?.mention?.id ?? "",
        semestreId: session?.semestre?.id ?? "",
        anneeId: param?.anneeId ?? "",
        sessionId: session?.id ?? ""
      },
      details: []
    };

    inscriptions.forEach((item) => {
      const d = cotation?.details?.find(
        (e) => e?.inscription?.id === item?.id
      );

      init.details.push({
        id: d?.id ?? "",
        cotationId: cotation?.id ?? "",
        inscriptionId: item?.id,
        mentionSemestreEcueId: row?.id ?? "",
        note: d?.note ?? null,
        credit: row?.credit ?? 0,
        estNoteAnnuelle: session.estAnnuel ?? false,
        estTransfere: false,
        estValide: false,
        estValideTransfert : false

      });
    });

    setData(init);
  }, [visible, cotation, inscriptions, row, session]);

  // =========================
  // HANDLE CHANGE (FIX IMPORTANT)
  // =========================
  const handleChange = (id, value) => {
    let v = value === "" ? "" : Number(value);

    if (v !== "" && v > 20) v = 20;
    if (v !== "" && v < 0) v = 0;

    setData((prev) => ({
      ...prev,
      details: prev.details.map((item) =>
        item.inscriptionId === id
          ? { ...item, note: v }
          : item
      )
    }));
  };

  // =========================
  // SAVE
  // =========================
    const handleSave = async () => {
      if (loading) return;

      try {
        setLoading(true);

        await cotationService.addWithDetails(data);

        const details = data?.details ?? [];

        const countWithCote = details.filter(
          (item) => item?.note != null
        ).length;

        const countManqueCote = details.filter(
          (item) => item?.note == null
        ).length;

        const newSaved = {
          ...saved,
          mentionSemestreEcueId: row?.id,
          estCote: true,
          countWithCote,
          countManqueCote,
        };

        setSaved(newSaved);

        showToast(
          `Les cotes des étudiants pour l’ECUE "${row?.ecueName ?? ""}" ont été ${
            cotation?.id ? "modifiées" : "enregistrées"
          } avec succès !`
        );

        onSubmit?.(newSaved);

        setTimeout(() => {
            setVisible(false);
        }, 1200);

      } catch (error) {
        console.error("Erreur save cotation:", error);
        showToast(
            `Erreur lors de ${cotation?.id ? "la modification" : "l'enregistrement"} des cotations`,
            "error"
        );
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
            Saisie des cotation
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
          <CCard className="border-0 shadow-sm mb-4" style={{ borderRadius: "14px" }}>
            <CCardBody>
              <CRow className="g-2">
                <CCol md={9}>
                  <div className="text-medium-emphasis small">Période</div>
                  <div className="fw-semibold">
                    {session?.sessionName ?? "-"} |{" "}
                    {session?.semestre?.semestreName ?? "-"} |{" "}
                    {param?.anneeId ?? "-"}
                  </div>
                </CCol>

                <CCol md={3}>
                  <div className="text-medium-emphasis small">Mention</div>
                  <div className="fw-semibold">
                    {param?.mention?.mentionName ?? "-"}
                  </div>
                </CCol>

                <CCol md={12} className="text-center">
                  <CBadge color="primary" shape="rounded-pill" className="px-4 py-2 mt-2 fs-6">
                    <div className="fw-semibold">{row?.ecueName ?? "-"}</div>
                  </CBadge>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>

          {/* LOADING */}
          {loading ? (
            <div className="text-center p-5">
              <CSpinner color="primary" />
            </div>
          ) : (
            <>
              {/* HEADER TABLE */}
              <div
                className="px-3 py-2 fw-semibold text-white"
                style={{
                  background: "linear-gradient(135deg,#321fdb,#4f46e5)"
                }}
              >
                <CRow>
                  <CCol md={8}>Étudiant</CCol>
                  <CCol className="text-center" md={4}>note /20</CCol>
                </CRow>
              </div>

              {/* LISTE */}
              <CListGroup flush className="shadow-sm">
                {(inscriptions ?? []).map((item, index) => {
                  const etudiant = item?.etudiant;

                  return (
                    <CListGroupItem
                      key={item?.id ?? index}
                      className="border-0 border-bottom py-0"
                      style={{
                        background: index % 2 === 0 ? "#fff" : "#f9fafc"
                      }}
                    >
                      <CRow className="align-items-center">
                        {/* ETUDIANT */}
                        <CCol md={8} className="d-flex align-items-center py-1 gap-3">
                          {item?.photo ? (
                            <img
                              src={item.photo}
                              alt="Photo étudiant"
                              width={40}
                              height={40}
                              className="rounded-circle border shadow-sm"
                              style={{ objectFit: "cover" }}
                            />
                          ) : (
                            <div
                              className="rounded-circle text-white fw-bold d-flex align-items-center justify-content-center shadow-sm"
                              style={{
                                width: 40,
                                height: 40,
                                background: "linear-gradient(135deg,#321fdb,#4f46e5)"
                              }}
                            >
                              {`${etudiant?.prenom?.charAt(0) || ""}${etudiant?.nom?.charAt(0) || ""}`}
                            </div>
                          )}

                          <div>
                            <div className="fw-semibold text-dark">
                              {[
                                etudiant?.nom?.toUpperCase(),
                                etudiant?.postnom?.toUpperCase(),
                                etudiant?.prenom
                              ]
                                .filter(Boolean)
                                .join(" ")}
                            </div>
                          </div>
                        </CCol>

                        {/* note */}
                        <CCol md={4}>
                          <CFormInput
                            type="number"
                            min={0}
                            max={20}
                            step="0.01"
                            placeholder="0 - 20"
                            value={getcote(item?.id) ?? ""}
                            onChange={(e) =>
                              handleChange(item?.id, e.target.value)
                            }
                            className="shadow-none text-center"
                            style={{
                              height: "30px",
                              borderRadius: "20px",
                              fontWeight: "600"
                            }}
                          />
                        </CCol>
                      </CRow>
                    </CListGroupItem>
                  );
                })}
              </CListGroup>

              {/* FOOTER */}
              <div
                className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top"
                style={{ background: "#f4f6fb" }}
              >
                <CButton color="light" onClick={() => setVisible(false)}>
                  Fermer
                </CButton>

                <CButton color="primary"
                onClick={handleSave}
                disabled={loading}
                >
                  <CIcon icon={cilSave} className="me-2" />
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
        `}
      </style>
    </CModal>
  );
}