import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from "react-router-dom";
import { isValidEmail, isValidName, isFormUserValid } from "@src/shared/validators"

import userService from "@src/infrastructure/services/userService"
import { useToast } from "@src/core/context/ToastContext";
import '@src/styles/global.css'

export default function EditUser() {

  const navigate = useNavigate()
  const location = useLocation()
  const { showToast } = useToast();

  const userToEdit = location.state?.user

  const [form, setForm] = useState({
    nom: '',
    email: '',
    password: ''
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Pré-remplissage
  useEffect(() => {
    if (userToEdit) {
      setForm({
        nom: userToEdit.nom || '',
        email: userToEdit.email || '',
        password: ''
      })
    }
    setLoading(false)
  }, [userToEdit])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setError("")

      if (userToEdit) {
        await userService.update(userToEdit.id, form)
      } else {
        await userService.add(form)
      }

      const msg = userToEdit
        ? "Utilisateur modifié avec succès !"
        : "Utilisateur enregistré avec succès !";

      showToast(msg)

      setTimeout(() => {
        navigate("/utilisateur")
      }, 2000)

    } catch (e) {
      console.error(e)
      setError("Erreur lors de l'opération")
      showToast("Une erreur s'est produite", "error")
    }
  }

  if (loading) return <p>Chargement...</p>

  return (
    <div className="main-div">
      <h3 className="text-center">
        {userToEdit ? "Modifier un utilisateur" : "Ajouter un utilisateur"}
      </h3>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="form-container">

        <div className="form-grid">
          <div className="input-wrapper">
            <label>Nom *</label>
            <input
              name="nom"
              className={!isValidName(form.nom) ? "input-error" : "input-simple"}
              value={form.nom}
              onChange={handleChange}
              autoComplete="off"
            />

            {!isValidName(form.nom) && form.nom && (
              <div className="error-dropdown">
                <div>⚠ Nom invalide</div>
                <div>• Minimum 2 caractères</div>
              </div>
            )}
          </div>

          <div className="input-wrapper">
            <label>Email</label>
            <input
              name="email"
              type="email"
              className={
                !isValidEmail(form.email) && form.email
                  ? "input-error"
                  : "input-simple"
              }
              value={form.email}
              onChange={handleChange}
              autoComplete="off"
            />
          </div>

          <div className="input-wrapper">
            <label>Mot de passe</label>
            <input
              name="password"
              type="password"
              className="input-simple"
              value={form.password}
              onChange={handleChange}
              placeholder={userToEdit ? "Laisser vide pour ne pas modifier" : ""}
            />
          </div>
        </div>

        <div className="btn-group-center d-flex align-items-center justify-content-center gap-2" >
          <button
            type="submit"
            className="btn btn-primary d-flex align-items-center justify-content-center gap-2"
            style={{width:"250px"}}
            disabled={!isFormUserValid(form)}>
            <i className={`bi ${userToEdit ? "bi-pencil" : "bi-check-circle"}`}></i>
            {userToEdit ? "Modifier" : "Enregistrer"}
          </button>

          <button
            type="button"
               style={{width:"250px"}}
            className="btn btn-secondary text-center d-flex justify-content-center"
            onClick={() => navigate(-1)}>
            Annuler
          </button>
        </div>

      </form>
    </div>
  )
}