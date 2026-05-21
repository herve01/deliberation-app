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

import anneeService from "@src/infrastructure/services/inscription/anneeService";

import { useToast } from "@src/app/context/ToastContext";

export default function EditAnnee() {

  const navigate = useNavigate()
  const location = useLocation()
  const { showToast } = useToast();

  const anneeToEdit = location.state?.annee

  const [form, setForm] = useState({
    annee: '',
    dateOuverture: '',
    dateCloture: ''
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // VALIDATION
  const isFormValid = (form) => {
    return (
      form.annee.trim().length >= 4 &&
      form.dateOuverture &&
      form.dateCloture &&
      new Date(form.dateCloture) >=
      new Date(form.dateOuverture)
    )
  }

  const isValid = isFormValid(form)

  // LOAD INITIAL
  useEffect(() => {

    if (anneeToEdit) {

      setForm({
        annee: anneeToEdit.annee || '',
        dateOuverture:
          anneeToEdit.dateOuverture?.slice(0, 10) || '',
        dateCloture:
          anneeToEdit.dateCloture?.slice(0, 10) || ''
      })

    }

    setLoading(false)

  }, [anneeToEdit])

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

      if (anneeToEdit) {

        await anneeService.update(
          anneeToEdit.id,
          form
        )

      } else {

        await anneeService.add(form)

      }

      showToast(
        anneeToEdit
          ? "Année modifiée avec succès !"
          : "Année enregistrée avec succès !"
      )

      setTimeout(() => {
        navigate("/inscription/annee-academique")
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
          {anneeToEdit
            ? "Modifier une année"
            : "Ajouter une année"}
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

            {/* ANNEE */}
            <CCol md={12}>

              <CFormLabel>
                Année *
              </CFormLabel>

              <CFormInput
                name="annee"
                placeholder="Ex: 2024-2025"
                value={form.annee}
                onChange={handleChange}
              />

            </CCol>

          </CRow>

          <CRow className="mb-4">

            {/* DATE OUVERTURE */}
            <CCol md={6}>

              <CFormLabel>
                Date ouverture *
              </CFormLabel>

              <CFormInput
                type="date"
                name="dateOuverture"
                value={form.dateOuverture}
                onChange={handleChange}
              />

            </CCol>

            {/* DATE CLOTURE */}
            <CCol md={6}>

              <CFormLabel>
                Date clôture *
              </CFormLabel>

              <CFormInput
                type="date"
                name="dateCloture"
                value={form.dateCloture}
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
                anneeToEdit
                  ? "bi-pencil"
                  : "bi-check-circle"
              }`} />

              {anneeToEdit
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