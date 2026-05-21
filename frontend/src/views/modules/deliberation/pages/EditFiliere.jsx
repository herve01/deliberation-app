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

import filiereService from "@src/infrastructure/services/inscription/filiereService";
import domaineService from "@src/infrastructure/services/inscription/domaineService";

import { useToast } from "@src/app/context/ToastContext";

export default function EditFiliere() {

  const navigate = useNavigate()
  const location = useLocation()
  const { showToast } = useToast();

  const filiereToEdit = location.state?.filiere

  const [form, setForm] = useState({
    intitule: '',
    domaineId: ''
  })

  const [domaines, setDomaines] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // VALIDATION
  const isFormValid = (form) => {
    return (
      isValidName(form.intitule) &&
      form.domaineId !== ''
    )
  }

  const isValid = isFormValid(form)

  // LOAD INITIAL
  useEffect(() => {

    async function load() {

      try {

        setLoading(true)

        const data = await domaineService.getAll()

        setDomaines(data)

        if (filiereToEdit) {

          setForm({
            intitule: filiereToEdit.intitule || '',
            domaineId:
              filiereToEdit.domaine?.id
                ? String(filiereToEdit.domaine.id)
                : ''
          })

        }

      } catch (e) {

        console.error(e)

        setError(
          "Impossible de charger les domaines"
        )

      } finally {

        setLoading(false)

      }
    }

    load()

  }, [filiereToEdit])

  // HANDLE CHANGE
  const handleChange = (e) => {

    const { name, value } = e.target

    setForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // SUBMIT
  const handleSubmit = async (e) => {

    e.preventDefault()

    if (!isValid) return

    try {

      if (filiereToEdit) {

        await filiereService.update(
          filiereToEdit.id,
          form
        )

      } else {

        await filiereService.add(form)

      }

      showToast(
        filiereToEdit
          ? "Filière modifiée avec succès !"
          : "Filière enregistrée avec succès !"
      )

      setTimeout(() => {
        navigate("/inscription/filiere")
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
          {filiereToEdit
            ? "Modifier une filière"
            : "Ajouter une filière"}
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

          <CRow className="mb-4">

            {/* DOMAINE */}
            <CCol md={12}>

              <CFormLabel>
                Domaine *
              </CFormLabel>

              <CFormSelect
                name="domaineId"
                value={form.domaineId}
                onChange={handleChange}
              >

                <option value="">
                  Choisir un domaine
                </option>

                {domaines.map((d) => (
                  <option
                    key={d.id}
                    value={String(d.id)}
                  >
                    {d.intitule}
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
                filiereToEdit
                  ? "bi-pencil"
                  : "bi-check-circle"
              }`} />

              {filiereToEdit
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