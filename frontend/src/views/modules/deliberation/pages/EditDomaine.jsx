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
  CRow,
  CAlert,
  CSpinner
} from '@coreui/react'

import domaineService from "@src/infrastructure/services/inscription/domaineService";

import { useToast } from "@src/app/context/ToastContext";

export default function EditDomaine() {

  const navigate = useNavigate()
  const location = useLocation()
  const { showToast } = useToast();

  const domaineToEdit = location.state?.domaine

  const [form, setForm] = useState({
    intitule: ''
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // VALIDATION
  const isFormValid = (form) => {
    return (
      form.intitule.trim().length >= 2
    )
  }

  const isValid = isFormValid(form)

  // LOAD INITIAL
  useEffect(() => {

    if (domaineToEdit) {

      setForm({
        intitule: domaineToEdit.intitule || ''
      })

    }

    setLoading(false)

  }, [domaineToEdit])

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

      if (domaineToEdit) {

        await domaineService.update(
          domaineToEdit.id,
          form
        )

      } else {

        await domaineService.add(form)

      }

      showToast(
        domaineToEdit
          ? "Domaine modifié avec succès !"
          : "Domaine enregistré avec succès !"
      )

      setTimeout(() => {
        navigate("/inscription/domaine")
      }, 1500)

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
          {domaineToEdit
            ? "Modifier un domaine"
            : "Ajouter un domaine"}
        </strong>
      </CCardHeader>

      <CCardBody>

        {error && (
          <CAlert color="danger">
            {error}
          </CAlert>
        )}

        <CForm onSubmit={handleSubmit}>

          <CRow className="mb-4">

            {/* INTITULE */}
            <CCol md={12}>

              <CFormLabel>
                Intitulé *
              </CFormLabel>

              <CFormInput
                name="intitule"
                placeholder="Ex: Informatique"
                value={form.intitule}
                onChange={handleChange}
              />

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
                domaineToEdit
                  ? "bi-pencil"
                  : "bi-check-circle"
              }`} />

              {domaineToEdit
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