// IMPORTS
import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
  useLocation,
} from "react-router-dom";

import {
  CCard,
  CRow,
  CCol,
  CCardBody,
  CCardHeader,
  CButton,
  CSpinner,
  CAlert,
  CBadge,
  CFormSelect,
  CInputGroup,
  CInputGroupText,
  CListGroup,
  CListGroupItem,
  CFormInput,
} from "@coreui/react";

import {
  cilPlus,
  cilPencil,
  cilTrash,
  cilCalendar,
  cilLibrary,
  cilEducation,
  cilSearch,
  cilReload,
} from "@coreui/icons";

import CIcon from "@coreui/icons-react";

import inscriptionService from "@src/infrastructure/services/inscription/inscriptionService";
import domaineService from "@src/infrastructure/services/inscription/domaineService";
import filiereService from "@src/infrastructure/services/inscription/filiereService";
import mentionService from "@src/infrastructure/services/inscription/mentionService";
import anneeService from "@src/infrastructure/services/inscription/anneeService";

import Table from "@src/views/modules/shared/components/TableWithoutSearch";

import { useToast } from "@src/app/context/ToastContext";

import "@src/styles/global.css";

export default function InscriptionList() {

  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  const [inscriptions, setInscriptions] = useState([]);
  const [annees, setAnnees] = useState([]);
  const [domaines, setDomaines] = useState([]);
  const [filieres, setFilieres] = useState([]);
  const [mentions, setMentions] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [param, setParam] =
    useState({
      anneeId:localStorage.getItem("anneeIdStored") || "",

      domaineId:localStorage.getItem("domaineIdStored") || "",

      filiereId:localStorage.getItem("filiereIdStored") || "",

      mentionId:localStorage.getItem("mentionIdStored") || "",

      mentionFullName:localStorage.getItem("mentionFullNameStored") || "",
    });

  const isValid =
    param.anneeId &&
    param.domaineId &&
    param.filiereId &&
    param.mentionId;

  // SAVE FILTERS
  useEffect(() => {
    Object.entries({
      anneeIdStored:param.anneeId,
      domaineIdStored:param.domaineId,
      filiereIdStored:param.filiereId,
      mentionIdStored:param.mentionId,
      mentionFullNameStored:param.mentionFullName,

    }).forEach(([key, value]) =>
      localStorage.setItem(key, value || "")
    );
  }, [param]);

  // LOAD BASE DATA
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);

        const [domainesData, anneesData,] = await Promise.all([
          domaineService.getAll(), anneeService.getAll(),]);

        setDomaines(domainesData || []);
        setAnnees(anneesData || []);

      } catch (e) {
        console.error(e);
        setError("Impossible de charger les inscriptions", "error");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [location.state]);

  // LOAD FILIERES
  useEffect(() => {
    async function loadFilieres() {

      if (!param.domaineId) {
        setFilieres([]);
        return;
      }

      try {
        const data = await filiereService.getAllByDomaine(param.domaineId);
        setFilieres(data || []);

      } catch (e) {
        console.error(e);
      }
    }

    loadFilieres();

  }, [param.domaineId]);

  // LOAD MENTIONS
  useEffect(() => {
    async function loadMentions() {

      if (!param.filiereId) {
        setMentions([]);
        return;
      }

      try {
        const data = await mentionService.getAllByFiliere(param.filiereId);
        setMentions(data || []);
      } catch (e) {
        console.error(e);
      }
    }

    loadMentions();

  }, [param.filiereId]);

  // LOAD INSCRIPTIONS
  useEffect(() => {

    let mounted = true;

    async function loadInscriptions() {

      try {

        if (!param.anneeId || !param.mentionId) {
          if (mounted) {
            setInscriptions([]);
          }
          return;
        }
        const data = await inscriptionService.getAllByAnneeMention(param.anneeId,param.mentionId);
        if (mounted) {
          setInscriptions(data || []);
        }
      } catch (e) {
        console.error(e);
        if (mounted) {
          setInscriptions([]);
        }
      }
    }

    loadInscriptions();

    return () => {
      mounted = false;
    };

  }, [param.anneeId, param.mentionId,]);

  // SELECTED MENTION
  useEffect(() => {

    if (!mentions.length || !param.mentionId) return;

    const found = mentions.find(
      (m) => m.id === param.mentionId
    );

    if (!found) return;

    setParam((prev) => ({
      ...prev,
      mentionFullName: [found?.niveau?.intitule, found?.intitule,]
        .filter(Boolean)
        .join(" "),
    }));

  }, [mentions, param.mentionId]);

  // HANDLE CHANGE
  const handleChange =
    (field) => (e) => {

      const value = e.target.value;

      setParam((prev) => ({
        ...prev,
        [field]: value,

        ...(field === "domaineId" && {
          filiereId: "",
          mentionId: "",
          mentionFullName: "",
        }),

        ...(field === "filiereId" && {
          mentionId: "",
          mentionFullName: "",
        }),
      }));
    };

  // HANDLE SELECT
  const handleSelect = (item) => {

    setParam((prev) => ({
      ...prev,
      mentionId: item.id,

      mentionFullName: [item?.niveau?.intitule, item?.intitule,]
        .filter(Boolean)
        .join(" "),
    }));
  };

  // RESET
  const handleReset = () => {
    ["anneeIdStored",
      "domaineIdStored",
      "mentionIdStored",
      "filiereIdStored",
      "mentionFullNameStored",
    ].forEach((key) =>
      localStorage.removeItem(key)
    );

    setParam({
      anneeId: "",
      domaineId: "",
      filiereId: "",
      mentionId: "",
      mentionFullName: "",
    });

    setInscriptions([]);
  };

  // FILTER
  const filteredData = useMemo(() => {

    const keyword = search.toLowerCase().trim();

    return inscriptions.filter(
      (row) => `${row?.etudiant?.nom || ""} ${row?.etudiant?.postnom || ""} ${row?.etudiant?.prenom || ""}`
          .toLowerCase()
          .includes(keyword)
    );

  }, [search, inscriptions]);

  // DELETE
  async function handleDelete(id) {
    if (!window.confirm(
        "Voulez-vous vraiment supprimer cette inscription ?"
      )
    ) return;

    try {

      await inscriptionService.delete(id);

      setInscriptions((prev) => prev.filter((item) => item.id !== id));

      showToast("Inscription supprimée avec succès !", "success");

    } catch (e) {
      console.error(e);
      showToast("Erreur lors de la suppression", "error");
    }
  }

  // EDIT
  function handleEdit(inscription) {
    navigate("/inscription/list/edit", {state: { inscription },});
  }

  // TABLE
  const columns = [
    {
      header: "Étudiant",
      accessor: "etudiant",

      render: (row) => (
        <div className="d-flex align-items-center gap-2">

          {/* PHOTO */}
          {row?.photo ? (
            <img
              src={row.photo}
              alt="Photo étudiant"
              width={42}
              height={42}
              className="rounded-circle border"
              style={{objectFit: "cover",}}
            />
          ) : (
            <div
              className="
                rounded-circle
                bg-primary
                text-white
                fw-bold
                d-flex
                align-items-center
                justify-content-center
              "
              style={{
                width: 42,
                height: 42,
                minWidth: 42,
              }}
            >
              {`${row?.etudiant?.prenom?.charAt(0) || ""
                }${row?.etudiant?.nom?.charAt(0) || ""
                }`}
            </div>
          )}

          {/* INFOS */}
          <div className="d-flex flex-column">
            <span className="fw-semibold">
              {[
                row?.etudiant?.nom?.toUpperCase(),
                row?.etudiant?.postnom?.toUpperCase(),
                row?.etudiant?.prenom?.toUpperCase(),
              ]
                .filter(Boolean)
                .join(" ")}
            </span>

            <small className="text-medium-emphasis">
              Né(e) le{" "}
              {row?.etudiant?.dateNaissance
                ? new Date(row.etudiant.dateNaissance).toLocaleDateString("fr-FR")
                : "-"}, {row?.etudiant?.sexe ?? "-"}
            </small>
          </div>
        </div>
      ),
    },

    {
      header: "Date Inscription",
      accessor: "date",

      render: (row) => (
          new Date(row?.date).toLocaleDateString("fr-FR")
      ),
    },

    {
      header: "Actions",
      accessor: "actions",

      render: (row) => (
        <div className="d-flex gap-2 justify-content-end">

          <CButton
            color="light"
            size="sm"
            className="border"
            onClick={() => handleEdit(row)}
          >
            <CIcon icon={cilPencil} />
          </CButton>

          <CButton
            color="light"
            size="sm"
            className="border text-danger"
            onClick={() => handleDelete(row.id)}
          >
            <CIcon icon={cilTrash} />
          </CButton>

        </div>
      ),
    },
  ];

  return (
    <div className="container-fluid px-2">
      <CCard className="shadow-sm">
        {/* HEADER */}
        <CCardHeader className="bg-light py-3 px-4">
          <div className="d-flex flex-column flex-lg-row justify-content-between gap-3">
            <div>
              <h4 className="fw-bold mb-1">
                Liste des inscriptions
              </h4>

              <div className="text-medium-emphasis">
                Gestion académique
              </div>
            </div>

            <div className="d-flex gap-2">
              <CButton
                color="light"
                className="border"
                onClick={handleReset}
              >
                <CIcon
                  icon={cilReload}
                  className="me-2"
                />
                Réinitialiser
              </CButton>

              <CButton
                color="primary"
                disabled={!isValid}
                onClick={() => navigate("/inscription/list/edit",{ state: { param } })
                }
              >
                <CIcon
                  icon={cilPlus}
                  className="me-2"
                />
                Ajouter
              </CButton>
            </div>
          </div>
        </CCardHeader>

        {/* BODY */}
        <CCardBody className="p-3">
          {/* FILTERS */}
          <CRow className="bg-light border rounded p-2 mb-3 g-2">
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

              <CCol
                key={field.label}
                xs={12} sm={6} md={4}
              >
                <CInputGroup>
                  <CInputGroupText>
                    <CIcon icon={field.icon} />
                  </CInputGroupText>

                  <CFormSelect
                    value={field.value}
                    onChange={field.onChange}
                  >
                    <option value="">
                      {field.label}
                    </option>

                    {field.options?.map(
                      (opt) => (
                        <option key={field.getValue(opt)}
                          value={field.getValue(opt)}>
                          {field.getLabel(opt)}
                        </option>
                      )
                    )}
                  </CFormSelect>
                </CInputGroup>
              </CCol>
            ))}
          </CRow>

          <CRow className="g-3">
            {/* SIDEBAR */}
            <CCol lg={3}>
              <CCard className="bg-light h-100">
                <CCardBody>
                  <div className="fw-bold mb-2">
                    Mentions
                  </div>

                  <CListGroup>
                    {mentions.map((m) => (
                      <CListGroupItem
                        key={m.id}
                        active={param.mentionId === m.id}
                        onClick={() => handleSelect(m)}
                        style={{ cursor: "hand",}}
                        className="py-2"
                      >
                        {m?.niveau?.intitule}{" "}
                        {m?.intitule}
                      </CListGroupItem>
                    ))}
                  </CListGroup>
                </CCardBody>
              </CCard>
            </CCol>

            {/* CONTENT */}
            <CCol lg={9}>
              <CCard className="shadow-sm h-100">
                <CCardBody className="p-3">
                  {/* TOP */}
                  <div className="d-flex flex-column flex-lg-row justify-content-between gap-3 mb-0 px-3 mb-2">
                    <div>

                      <div className="small text-medium-emphasis mt-2">
                        {filteredData.length} étudiant(s) | <strong>{param?.mentionFullName}</strong>
                      </div>

                    </div>

                    <div
                      style={{
                        width: "100%",
                        maxWidth: 350,
                      }}>
                      <CInputGroup>
                        <CInputGroupText>
                          <CIcon icon={cilSearch} />
                        </CInputGroupText>

                        <CFormInput
                          placeholder="Rechercher..."
                          value={search}
                          onChange={(e) => setSearch(e.target.value)
                          }
                        />
                      </CInputGroup>
                    </div>
                  </div>

                  {/* CONTENT */}
                  {loading ? (
                    <div className="text-center py-5 px-3">
                      <CSpinner color="primary" />
                    </div>
                  ) : error ? (
                    <CAlert color="danger">
                      {error}
                    </CAlert>
                  ) : !param?.mentionId ? (
                    <CAlert color="info">
                      Sélectionnez une mention
                    </CAlert>
                  ) : filteredData.length === 0 ? (
                    <CAlert color="warning">
                      Aucune inscription trouvée
                    </CAlert>
                  ) : (
                    <Table
                      columns={columns}
                      data={filteredData}
                      itemsPerPage={10}
                      enableSearch={false}
                    />
                  )}
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </div>
  );
}