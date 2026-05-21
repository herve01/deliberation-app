import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from "react-router-dom";

import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CRow,
  CAlert,
  CSpinner
} from '@coreui/react'

import { isValidName } from "@src/shared/validators"

import mentionService from "@src/infrastructure/services/inscription/mentionService";
import filiereService from "@src/infrastructure/services/inscription/filiereService";
import niveauService from "@src/infrastructure/services/inscription/niveauService";
import domaineService from "@src/infrastructure/services/inscription/domaineService";

import { useToast } from "@src/app/context/ToastContext";

export default function EditMention() {

  const navigate = useNavigate()
  const location = useLocation()
  const { showToast } = useToast();

  const mentionToEdit = location.state?.mention

  const [form, setForm] = useState({
    intitule: '',
    domaineId: '',
    filiereId: '',
    niveauId: ''
  })

  const [filieres, setFilieres] = useState([])
  const [domaines, setDomaines] = useState([])
  const [niveaux, setNiveaux] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const isFormValid = (form) => {
    return (
      isValidName(form.intitule) &&
      form.domaineId !== '' &&
      form.filiereId !== '' &&
      form.niveauId !== ''
    )
  }

  const isValid = isFormValid(form)

  // LOAD INITIAL
  useEffect(() => {

    async function load() {

      try {

        setLoading(true)

        const domaineData = await domaineService.getAll()
        setDomaines(domaineData)

        /*const niveauxData = await niveauService.getAll()
        setNiveaux(niveauxData)*/

        if (mentionToEdit) {

          const domaineId =
            mentionToEdit.filiere?.domaine?.id || ''

          setForm({
            intitule: mentionToEdit.intitule || '',
            domaineId: domaineId
              ? String(domaineId)
              : '',
            filiereId: mentionToEdit.filiere?.id
              ? String(mentionToEdit.filiere.id)
              : '',
            niveauId: mentionToEdit.niveau?.id
              ? String(mentionToEdit.niveau.id)
              : '',
          })
        }

      } catch (e) {

        console.error(e)
        setError("Impossible de charger les données")

      } finally {
        setLoading(false)
      }
    }

    load()

  }, [mentionToEdit])

  // LOAD FILIERES
  useEffect(() => {

    async function loadFilieres() {

      if (!form.domaineId) {
        setFilieres([])
        return
      }

      try {

        const data = await filiereService.getAllByDomaine(form.domaineId)

        setFilieres(data)

      } catch (e) {
        console.error(e)
      }
    }
    loadFilieres()

  }, [form.domaineId])


 // LOAD NIVEAU
  useEffect(() => {

    async function loadNiveaux() {

      if (!form.filiereId) {
        setNiveaux([])
        return
      }

      try {

        const isLmdSystem = filieres.find((f) => f.id === form.filiereId).oldSystem

        const data = await niveauService.getAllLMD(isLmdSystem)

        setNiveaux(data)

      } catch (e) {
        console.error(e)
      }
    }
    loadNiveaux()

  }, [form.filiereId])

  // HANDLE CHANGE
  const handleChange = (e) => {

    const { name, value } = e.target

    setForm(prev => ({
      ...prev,
      [name]: value,
      ...(name === "domaineId" && {
        filiereId: ''
      })
    }))
  }

  // SUBMIT
  const handleSubmit = async (e) => {

    e.preventDefault()

    if (!isValid) return

    try {

      if (mentionToEdit) {
        await mentionService.update(mentionToEdit.id,form)
      } else {
        await mentionService.add(form)
      }

      showToast(
        mentionToEdit
          ? "Mention modifiée avec succès !"
          : "Mention enregistrée avec succès !"
      )

      setTimeout(() => {
        navigate("/inscription/mention")
      }, 2000)

    } catch (e) {
      console.error(e)
      setError("Erreur lors de l'opération")
      showToast(
        "Une erreur s'est produite",
        "error"
      )
    }
  }
  if (loading) {
    return (
      <div className="text-center mt-5">
        <CSpinner color="primary" />
      </div>
    )
  }

  return (
      <CCard className="border-1 shadow-sm">
        <CCardHeader>
          <strong>
            {mentionToEdit
              ? "Modifier une mention"
              : "Ajouter une mention"}
          </strong>
        </CCardHeader>

        <CCardBody>
          {error && (
            <CAlert color="danger">
              {error}
            </CAlert>
          )}

          <CForm onSubmit={handleSubmit}>
            <CRow className="mb-3">
              {/* INTITULE */}
              <CCol md={12}>
                <CFormLabel>
                  Intitulé *
                </CFormLabel>

                <CFormInput
                  name="intitule"
                  placeholder="Ex. Informatique"
                  value={form.intitule}
                  onChange={handleChange}
                  invalid={!isValidName(form.intitule)}
                />

              </CCol>
            </CRow>

            <CRow className="mb-3">

              {/* DOMAINE */}
              <CCol md={6}>

                <CFormLabel>
                  Domaine *
                </CFormLabel>

                <CFormSelect
                  name="domaineId"
                  value={form.domaineId}
                  onChange={handleChange}>
                  <option value="">
                    Choisir un domaine
                  </option>

                  {domaines.map((d) => (
                    <option
                      key={d.id}
                      value={String(d.id)}>
                      {d.intitule}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>

              {/* FILIERE */}
              <CCol md={6}>

                <CFormLabel>
                  Filière *
                </CFormLabel>

                <CFormSelect
                  name="filiereId"
                  disabled={!form.domaineId}
                  value={form.filiereId}
                  onChange={handleChange}
                >

                  <option value="">
                    Choisir une filière
                  </option>

                  {filieres.map((f) => (
                    <option
                      key={f.id}
                      value={String(f.id)}
                    >
                      {f.intitule}
                    </option>
                  ))}

                </CFormSelect>

              </CCol>

            </CRow>

            <CRow className="mb-4">

              {/* NIVEAU */}
              <CCol md={12}>

                <CFormLabel>
                  Niveau *
                </CFormLabel>

                <CFormSelect
                  name="niveauId"
                  disabled={!form.filiereId}
                  value={form.niveauId}
                  onChange={handleChange}
                >

                  <option value="">
                    Choisir un niveau
                  </option>

                  {niveaux.map((n) => (
                    <option
                      key={n.id}
                      value={String(n.id)}
                    >
                      {n.intitule}
                    </option>
                  ))}

                </CFormSelect>

              </CCol>

            </CRow>

            {/* BUTTONS */}
            <div className="d-flex justify-content-center gap-3">

              <CButton
                type="submit"
                color="primary"
                style={{ width: 200 }}
                className="d-flex align-items-center justify-content-center"
                disabled={!isValid}
              >

                <i className={`bi me-2 ${
                  mentionToEdit
                    ? "bi-pencil"
                    : "bi-check-circle"
                }`} />

                {mentionToEdit
                  ? "Modifier"
                  : "Enregistrer"}

              </CButton>

              <CButton
                type="button"
                color="secondary"
                style={{ width: 200 }}
                onClick={() => navigate(-1)}
                className="d-flex align-items-center justify-content-center"
              >
                Annuler
              </CButton>

            </div>

          </CForm>

        </CCardBody>

      </CCard>
  )
}