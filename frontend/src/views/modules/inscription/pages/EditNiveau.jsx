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
  CSpinner,
  CFormSwitch,
  CFormSelect
} from '@coreui/react'

import { isValidName } from "@src/shared/validators"

import niveauService from "@src/infrastructure/services/inscription/niveauService";
import cycleService from "@src/infrastructure/services/inscription/cycleService";

import { useToast } from "@src/app/context/ToastContext";

export default function EditNiveau() {

  const navigate = useNavigate()
  const location = useLocation()
  const { showToast } = useToast();

  const niveauToEdit = location.state?.niveau

  const [cycles, setCycles] = useState([])

  const [form, setForm] = useState({
    cycleId: '',
    intitule: '',
    ordre: 1,
    oldSystem: false
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // VALIDATION
  const isFormValid = (form) => {
    return (
      form.cycleId &&
      isValidName(form.intitule) &&
      Number(form.ordre) > 0
    )
  }

  const isValid = isFormValid(form)

  // LOAD INITIAL
  useEffect(() => {

    const loadData = async () => {

      try {

        const cycleData = await cycleService.getAll()

        setCycles(cycleData || [])

        if (niveauToEdit) {

          setForm({
            cycleId: niveauToEdit.cycle.id || '',
            intitule: niveauToEdit.intitule || '',
            ordre: niveauToEdit.ordre || 1,
            oldSystem: niveauToEdit.oldSystem || false
          })

        }

      } catch (e) {

        console.error(e)
        setError("Erreur lors du chargement des données")

      } finally {

        setLoading(false)

      }
    }

    loadData()

  }, [niveauToEdit])

  // HANDLE CHANGE
  const handleChange = (e) => {

    const { name, value, type, checked } = e.target

    setForm(prev => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "ordre"
            ? Number(value)
            : value
    }))
  }

  // SUBMIT
  const handleSubmit = async (e) => {

    e.preventDefault()

    if (!isValid) return

    try {

      if (niveauToEdit) {

        await niveauService.update(
          niveauToEdit.id,
          form
        )

      } else {

        await niveauService.add(form)

      }

      showToast(
        niveauToEdit
          ? "Niveau modifié avec succès !"
          : "Niveau enregistré avec succès !"
      )

      setTimeout(() => {
        navigate("/inscription/niveau")
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

    <CCard className="border-1 shadow-s">

      <CCardHeader>
        <strong>
          {niveauToEdit
            ? "Modifier un niveau"
            : "Ajouter un niveau"}
        </strong>
      </CCardHeader>

      <CCardBody className="p-4">

        {error && (
          <CAlert color="danger">
            {error}
          </CAlert>
        )}

        <CForm onSubmit={handleSubmit}>

          {/* CYCLE */}
          <CRow className="mb-3">

            <CCol md={12}>

              <CFormLabel>
                Cycle *
              </CFormLabel>

              <CFormSelect
                name="cycleId"
                value={form.cycleId}
                onChange={handleChange}
              >

                <option value="">
                  -- Sélectionner un cycle --
                </option>

                {cycles.map((cycle) => (
                  <option
                    key={cycle.id}
                    value={cycle.id}
                  >
                    {cycle.intitule}
                  </option>
                ))}

              </CFormSelect>

            </CCol>

          </CRow>

          {/* INTITULE + ORDRE */}
          <CRow className="mb-3">

            <CCol md={6}>

              <CFormLabel>
                Intitulé *
              </CFormLabel>

              <CFormInput
                name="intitule"
                placeholder="Ex. L1, L2, M1..."
                value={form.intitule}
                onChange={handleChange}
                invalid={
                  form.intitule &&
                  !isValidName(form.intitule)
                }
              />

            </CCol>

            <CCol md={6}>

              <CFormLabel>
                Ordre *
              </CFormLabel>

              <CFormInput
                type="number"
                min={1}
                name="ordre"
                value={form.ordre}
                onChange={handleChange}
              />

            </CCol>

          </CRow>

          {/* SYSTEME */}
          <CRow className="mb-4">

            <CCol md={12}>

              <div className="border rounded-3 p-3 bg-light">

                <CFormSwitch
                  size="xl"
                  name="oldSystem"
                  checked={form.oldSystem}
                  onChange={handleChange}
                  label={
                    form.oldSystem
                      ? "Ancien système académique"
                      : "Système LMD"
                  }
                />

                <small className="text-muted">

                  {form.oldSystem
                    ? "Ce niveau appartient à l'ancien système."
                    : "Ce niveau appartient au système LMD."}

                </small>

              </div>

            </CCol>

          </CRow>

          {/* BUTTONS */}
          <div className="d-flex justify-content-center gap-3 mt-4">

            <CButton
              type="submit"
              color="primary"
              style={{ width: 200 }}
              className="d-flex align-items-center justify-content-center"
              disabled={!isValid}
            >

              <i className={`bi me-2 ${
                niveauToEdit
                  ? "bi-pencil-square"
                  : "bi-check-circle"
              }`} />

              {niveauToEdit
                ? "Modifier"
                : "Enregistrer"}

            </CButton>

            <CButton
              type="button"
              color="light"
              style={{ width: 200 }}
              onClick={() => navigate(-1)}
              className="border d-flex align-items-center justify-content-center"
            >

              <i className="bi bi-arrow-left me-2" />

              Retour

            </CButton>

          </div>

        </CForm>

      </CCardBody>

    </CCard>
  )
}