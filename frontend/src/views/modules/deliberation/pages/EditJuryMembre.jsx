import React, { useEffect, useRef, useState } from "react";

import {
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CRow,
  CCol,
  CButton,
  CFormInput,
  CFormSelect,
  CFormLabel,
  CAlert,
  CSpinner,
  CImage,
  CFormFeedback,
  CInputGroup,
  CInputGroupText,
  CListGroup,
  CListGroupItem,
} from "@coreui/react";

import CIcon from "@coreui/icons-react";

import {
  cilCheckCircle, cilArrowLeft, cilCamera,
  cilCloudUpload, cilTrash, cilUser,
  cilPhone, cilGlobeAlt, cilBirthdayCake,
  cilSave, cilXCircle, cilBadge, cilPeople,
  cilCalendar, cilEducation, cilLibrary, cilPlus, cilPencil
} from "@coreui/icons";

import { useNavigate, useLocation } from "react-router-dom";

import { isValidName, isValidPhone } from "@src/shared/validators";

import juryMembreDetailService from "@src/infrastructure/services/deliberation/juryMembreDetailService";
import domaineService from "@src/infrastructure/services/inscription/domaineService";
import anneeService from "@src/infrastructure/services/inscription/anneeService";
import filiereService from "@src/infrastructure/services/inscription/filiereService";
import mentionService from "@src/infrastructure/services/inscription/mentionService";

import personnelService from "@src/infrastructure/services/deliberation/personnelService";

import ChoosenJuryMembreModal from "@src/views/modules/deliberation/pages/modal/ChoosenJuryMembreModal";

import { useToast } from "@src/app/context/ToastContext";

const STORAGE = {
  anneeId: "anneeIdStored",
  domaineId: "domaineIdStored",
  filiereId: "filiereIdStored",
  mentionId: "mentionIdStored",
};

export default function EditJuryMembre() {
    const navigate = useNavigate();
    const location = useLocation();
    const { showToast } = useToast();

    const [domaines, setDomaines] = useState([]);
    const [filieres, setFilieres] = useState([]);
    const [mentions, setMentions] = useState([]);
    const [annees, setAnnees] = useState([]);
    const [personnels, setPersonnels] = useState([]);
    const [selectedRowIndex, setSelectedRowIndex] = useState(null);

    const [details, setDetails] = useState([]);

    const [role, setRole] = useState(null);

    const [selectedMention, setSelectedMention] = useState(null);

    const [loading, setLoading] = useState(false);

    const [visible, setVisible] = useState(false);

    const [initialLoading, setInitialLoading] = useState(true);

    const [error, setError] = useState("");

    const [param, setParam] = useState({
        anneeId: localStorage.getItem(STORAGE.anneeId) || "",
        domaineId: localStorage.getItem(STORAGE.domaineId) || "",
        filiereId: localStorage.getItem(STORAGE.filiereId) || "",
        mentionId: localStorage.getItem(STORAGE.mentionId) || ""
    })

 const handleEdit = (index, role) => {
     setSelectedRowIndex(index);
     setRole(role);
     setVisible(true);
  };

const handleModalSubmit = (data) => {
  setDetails((prev) =>
    prev.map((item, index) => {
      if (index !== selectedRowIndex) {
        return item;
      }

      const juryIndex = item.jury.findIndex(
        (j) => j.role === role
      );

      if (juryIndex !== -1) {
        const newJury = [...item.jury];

        newJury[juryIndex] = {
          ...newJury[juryIndex],
          personnel: data,
        };

        return {
          ...item,
          jury: newJury,
        };
      }

      return {
        ...item,
        jury: [
          ...item.jury,
          {
            id: "",
            personnel: data,
            role,
          },
        ],
      };
    })
  );

  setSelectedRowIndex(null);
};

  const personnelToEdit = location.state?.jury;
  //const param = location.state?.param || {};

  const [form, setForm] = useState([]);

  useEffect(() => {
    localStorage.setItem(STORAGE.anneeId, param.anneeId || "");
    localStorage.setItem(STORAGE.domaineId, param.domaineId || "");
    localStorage.setItem(STORAGE.filiereId, param.filiereId || "");
    localStorage.setItem(STORAGE.mentionId, param.mentionId || "");
  }, [param]);

  // LOAD
  useEffect(() => {
    async function load() {
      try {
        setInitialLoading(true);

        const [d, a, p] = await Promise.all([
          domaineService.getAll(),
          anneeService.getAll(),
          personnelService.getAll(),
        ]);

        setDomaines(d || []);
        setAnnees(a || []);
        setPersonnels(p || []);

        if (personnelToEdit) {
          setForm({
            matricule: personnelToEdit?.matricule || "",
            nom: personnelToEdit?.nom || "",
            postnom: personnelToEdit?.postnom || "",
            prenom: personnelToEdit?.prenom || "",
            sexe: personnelToEdit?.sexe || "Homme",
            paysNaissanceId: String(personnelToEdit?.paysNaissance?.id || ""),
            lieuNaissance: personnelToEdit?.lieuNaissance || "",
            dateNaissance: personnelToEdit?.dateNaissance || "",
            telephone: personnelToEdit?.telephone || "",
            grade: personnelToEdit?.grade || "",
            matricule: personnelToEdit?.grade || "",
          });
        }
      } catch (e) {
        setError("Impossible de charger les données");
      } finally {
        setInitialLoading(false);
      }
    }

    load();
  }, [personnelToEdit]);

  const handleChange = (f) => (e) => {
    const v = e.target.value;

    setParam(p => ({
      ...p,
      [f]: v,
      ...(f === "domaineId" && { filiereId: "", mentionId: "" }),
      ...(f === "filiereId" && { mentionId: "" }),
    }));
  };

  const handleSelectMention = (m) => {
    setSelectedMention(m);

    setParam(p => ({
      ...p,
      mentionId: m.id,
    }));
  };

  useEffect(() => {
    if (!param.domaineId) return setFilieres([]);

    filiereService.getAllByDomaine(param.domaineId)
      .then(setFilieres)
      .catch(() => setFilieres([]));
  }, [param.domaineId]);

  useEffect(() => {
    if (!param.filiereId) return setMentions([]);

    mentionService.getAllByFiliere(param.filiereId)
      .then(setMentions)
      .catch(() => setMentions([]));
  }, [param.filiereId]);

  const isValid = details?.length > 0

  const isValidAddButton = selectedMention && param?.anneeId;


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValid) {
      showToast("Veuillez remplir les champs obligatoires", "warning");
      return;
    }

    const data = [];

    try {
      setLoading(true);
      setError("");

      details.forEach((row) => {
        row.jury.forEach((j) => {
            data.push({
              id: "",
              mentionId: row?.mention?.id, // ou row?.mentionId selon ta structure
              anneeId: row?.anneeId,
              personnelId: j?.personnel?.id,
              role: j?.role,
            });

        });
      });

      if (personnelToEdit?.id) {
        await juryMembreDetailService.update(personnelToEdit.id, data);
      } else {
        await juryMembreDetailService.addAll(data);
      }

      showToast("jury enregistrée avec succès", "success");

      setTimeout(() => navigate("/deliberation/membre-jury"), 1200);
    } catch (err) {
      setError("Erreur lors de l'enregistrement");
      showToast("Erreur lors de l'enregistrement", "error");
    } finally {
      setLoading(false);
    }
  };

const [mentionItems, setMentionItems] = useState([
  { mention: null }
]);

const handleMentionChange = (index, mention) => {
  const updated = [...mentionItems];
  updated[index].mention = mention;
  setMentionItems(updated);
};

const handleAddLine = () => {
  setDetails((prev) => [
    ...prev,
    {
      mention: selectedMention,
      anneeId: param?.anneeId,
      jury: [],
    },
  ]);
};

const handleRemoveLine = (index) => {
  setDetails(details.filter((_, i) => i !== index));
};

  if (initialLoading) {
    return (
      <div className="text-center mt-5">
        <CSpinner color="primary" />
      </div>
    );
  }

  return (
    <CCard className="shadow-sm border-1">

      <CCardHeader className="bg-light">
        <div>
          <h5 className="mb-0 fw-bold">
            {personnelToEdit
              ? "Modifier jury"
              : "Ajouter jury"}
          </h5>
          <small className="text-medium-emphasis">
            Gestion des personnels
          </small>
        </div>
      </CCardHeader>

      <CCardBody>

        {error && <CAlert color="danger">{error}</CAlert>}

        <CForm onSubmit={handleSubmit}>
          <CRow>
              {/* FILTERS */}
              <CRow className="bg-light border rounded p-2 mb-2 g-1"
              >
                {[
                  {
                    label: "Année",
                    icon: cilCalendar,
                    value: param.anneeId,
                    onChange: handleChange("anneeId"),
                    options: annees,
                    getLabel: (a) => a.annee,
                    getValue: (a) => a.id,
                  },
                  {
                    label: "Domaine",
                    icon: cilLibrary,
                    value: param.domaineId,
                    onChange: handleChange("domaineId"),
                    options: domaines,
                    getLabel: (d) => d.intitule,
                    getValue: (d) => d.id,
                  },
                  {
                    label: "Filière",
                    icon: cilEducation,
                    value: param.filiereId,
                    onChange: handleChange("filiereId"),
                    options: filieres,
                    getLabel: (f) => f.intitule,
                    getValue: (f) => f.id,
                  },
                ].map((field) => (
                  <CCol key={field.label} xs={12} sm={6} md={4} className="px-2">
                    <CInputGroup>
                      <CInputGroupText>
                        <CIcon icon={field.icon} />
                      </CInputGroupText>

                      <CFormSelect value={field.value} onChange={field.onChange}>
                        <option value="">{field.label}</option>

                        {field.options?.map((opt) => (
                          <option key={field.getValue(opt)} value={field.getValue(opt)}>
                            {field.getLabel(opt)}
                          </option>
                        ))}
                      </CFormSelect>
                    </CInputGroup>
                  </CCol>
                ))}
              </CRow>

             <CCol md={3}>
                 <div className="fw-bold mb-2">Mentions</div>
                     <CListGroup>
                       {mentions.map(m => (
                         <CListGroupItem
                           key={m.id}
                           active={selectedMention?.id === m.id}
                           onClick={() => handleSelectMention(m)}
                           style={{ cursor: "hand" }}
                           className="mb-1 py-1"
                         >
                           {m?.niveau?.intitule} {m?.intitule}
                         </CListGroupItem>
                       ))}
                   </CListGroup>
             </CCol>

              <CCol md={9}>
                    <CRow>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <div className="fw-bold">
                          Membre de jury
                        </div>

                        <CButton color="primary"
                            size="sm"
                            onClick={handleAddLine}
                            disabled={!isValidAddButton}
                            >
                          <CIcon icon={cilPlus} className="me-1" />
                          Ajouter
                        </CButton>
                      </div>
                      <CRow className="bg-light p-1">
                          <CCol>Mention</CCol>
                          <CCol>Année</CCol>
                          <CCol>Président</CCol>
                          <CCol>Secretaire</CCol>
                          <CCol>Membre</CCol>

                          <CCol className="text-end  justify-content-center" md={1}>
                              <div className="d-flex justify-content-end align-items-center">
                               Action
                             </div>
                          </CCol>
                       </CRow>
                     <CListGroup>
                       {details.map((row, index) => {
                         const president =
                           row?.jury?.find((j) => j.role === "PRESIDENT")?.personnel || {};

                         const secretaire =
                           row?.jury?.find((j) => j.role === "SECRETAIRE")?.personnel || {};

                         const membre =
                           row?.jury?.find((j) => j.role === "MEMBRE")?.personnel || {};

                         return (
                           <CListGroupItem
                             key={index}
                             style={{ cursor: "pointer" }}
                             className="mb-1 py-1"
                           >
                             <CRow>
                               <CCol md={2}>
                                 {row?.mention?.mentionName}
                               </CCol>

                               <CCol md={2}>
                                 {row?.anneeId}
                               </CCol>

                               {/* Président */}
                               <CCol>
                                 <div className="d-flex justify-content-between align-items-center">
                                   <div>
                                     {[
                                       president?.nom?.toUpperCase(),
                                       president?.prenom,
                                     ]
                                       .filter(Boolean)
                                       .join(" ")}
                                   </div>

                                   <CButton
                                     color="warning"
                                     size="sm"
                                     variant="ghost"
                                     onClick={() => handleEdit(index, "PRESIDENT")}
                                   >
                                     <CIcon icon={cilPencil} />
                                   </CButton>
                                 </div>
                               </CCol>

                               {/* Secrétaire */}
                               <CCol>
                                 <div className="d-flex justify-content-between align-items-center">
                                   <div>
                                     {[
                                       secretaire?.nom?.toUpperCase(),
                                       secretaire?.prenom,
                                     ]
                                       .filter(Boolean)
                                       .join(" ")}
                                   </div>

                                   <CButton
                                     color="warning"
                                     size="sm"
                                     variant="ghost"
                                     onClick={() => handleEdit(index, "SECRETAIRE")}
                                   >
                                     <CIcon icon={cilPencil} />
                                   </CButton>
                                 </div>
                               </CCol>

                               {/* Membres */}
                               <CCol>
                                 <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                      {[
                                        membre?.nom?.toUpperCase(),
                                        membre?.prenom,
                                      ]
                                        .filter(Boolean)
                                        .join(" ")}
                                    </div>

                                   <CButton
                                     color="warning"
                                     size="sm"
                                     variant="ghost"
                                     onClick={() => handleEdit(index, "MEMBRE")}>
                                     <CIcon icon={cilPencil} />
                                   </CButton>
                                 </div>
                               </CCol>

                               <CCol className="text-end" md={1}>
                                 <div className="d-flex justify-content-end align-items-center">
                                   <CButton
                                     color="danger"
                                     size="sm"
                                     variant="ghost"
                                     onClick={() => handleRemoveLine(index)}>
                                     <CIcon icon={cilTrash} />
                                   </CButton>
                                 </div>
                               </CCol>
                             </CRow>
                           </CListGroupItem>
                         );
                       })}
                     </CListGroup>
                 </CRow>
              </CCol>
          </CRow>

          {/* BUTTONS */}

          <div className="d-flex justify-content-center gap-3">
              <CButton
                type="submit"
                color="primary"
                style={{ width: 220 }}
                disabled={!isValid}
              >
                <CIcon icon={cilSave} className="me-2" />
                {personnelToEdit ? "Modifier" : "Enregistrer"}
              </CButton>

              <CButton
                type="button"
                color="secondary"
                style={{ width: 220 }}
                onClick={() => navigate(-1)}
              >
                <CIcon icon={cilXCircle} className="me-2" />
                Annuler
              </CButton>
            </div>
        </CForm>
      </CCardBody>

     {isValidAddButton && (
        <ChoosenJuryMembreModal
          visible = {visible}
          setVisible = {setVisible}
          personnels = {personnels}
          onSubmit={handleModalSubmit}
        />
      )}
    </CCard>
  );
}