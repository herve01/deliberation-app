import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from "react-router-dom";

import ErrorMessage from "@src/shared/ErrorMessage"
import { isValidEmail, isValidPhone, isValidName, isFormValid } from "@src/shared/validators"
import userService from "@src/infrastructure/services/userService"
import contactService from "@src/infrastructure/services/contactService"
import '@src/styles/global.css'
import { useToast } from "@src/ToastContext";

export default function EditContact() {

  const navigate = useNavigate()
  const location = useLocation()
  const { showToast } = useToast();

  const contactToEdit = location.state?.contact

  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    email: '',
    poste: '',
    direction: '',
    bureau: '',
    utilisateurId: ''
  })

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  //Charger utilisateurs + pré-remplir si édition
  useEffect(() => {
    async function load() {
      try {
        setLoading(true)

        const data = await userService.getAll()
        setUsers(data)

         if (contactToEdit) {
           setForm({
             ...contactToEdit,
             utilisateurId: contactToEdit.utilisateurId
               ? String(contactToEdit.utilisateurId)
               : ''
           })
         }

      } catch (e) {
        setError("Impossible de charger les utilisateurs")
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [contactToEdit])

  // Gestion input
  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  // Submit (CREATE ou UPDATE)
  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
        if (contactToEdit) {
            await contactService.update(contactToEdit.id, form)
            } else {
            await contactService.add(form)
        }
        const msg = contactToEdit
          ? "Contact modifié avec succès !"
          : "Contact enregistré avec succès !";

        showToast(msg);
        setTimeout(() => {
            navigate("/contact")
        }, 3000);

    } catch (e) {
      console.error(e)
      setError("Erreur lors de l'opération")
      showToast("une erreur s'est produit, veuillez contactez l'administrateur", "error");
    }
  }

  if (loading) return <p>Chargement...</p>

  return (
    <div className="main-div-edit">
      <h3>
        {contactToEdit ? "Modifier un contact" : "Ajouter un contact"}
      </h3>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns:'repeat(3, 2fr)', gap: 8 }}>
            <div className="input-wrapper">
              <label>Nom *</label>
              <input
                name="nom"
                placeholder="Ex. XXXX"
                className={!isValidName(form.nom) ? "input-error" : "input-simple"}
                value={form.nom}
                onChange={handleChange}
              />
              {!isValidName(form.nom) && form.nom && (
                <div className="error-dropdown">
                  <div>⚠ Nom invalide</div>
                  <div>• Minimum 2 caractères</div>
                </div>
              )}
            </div>

            <div className="input-wrapper">
              <label>Prénom *</label>
              <input
                name="prenom"
                className={!isValidName(form.prenom) ? "input-error" : "input-simple"}
                value={form.prenom}
                onChange={handleChange}
              />
              {!isValidName(form.prenom) && form.prenom && (
                <div className="error-dropdown">
                  <div>⚠ Prénom invalide</div>
                  <div>• Minimum 2 caractères</div>
                </div>
              )}
            </div>

            <div className="input-wrapper">
              <label>Téléphone *</label>
              <input
                name="telephone"
                className={!isValidPhone(form.telephone) ? "input-error" : "input-simple"}
                value={form.telephone}
                onChange={handleChange}
              />
            </div>

            <div className="input-wrapper">
              <label>Email</label>
              <input
                name="email"
                className={!isValidEmail(form.email) && form.email ? "input-error" : "input-simple"}
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className="input-wrapper">
              <label>Poste</label>
              <input
                name="poste"
                className="input-simple"
                value={form.poste}
                onChange={handleChange}
              />
            </div>

            <div className="input-wrapper">
              <label>Direction</label>
              <input
                name="direction"
                className="input-simple"
                value={form.direction}
                onChange={handleChange}
              />
            </div>

            <div className="input-wrapper">
              <label>Bureau</label>
              <input
                name="bureau"
                className="input-simple"
                value={form.bureau}
                onChange={handleChange}
              />
            </div>

            <div className="input-wrapper">
              <label>Utilisateur</label>
              <select
                name="utilisateurId"
                className="select-modern"
                value={form.utilisateurId || ""}
                onChange={handleChange}
              >
                <option value="">Choisir un utilisateur</option>
                {users.map((u) => (
                  <option key={u.id} value={String(u.id)}>
                    {u.nom}
                  </option>
                ))}
              </select>
            </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns:'repeat(2, auto)', justifyContent: 'center', gap: 8, margin:"10px" }}>
            <button
                  type="submit"
                  style={{ width: 200 }}
                  className="btn btn-primary d-flex align-items-center justify-content-center gap-2"
                  disabled={!isFormValid(form)}>
                  <i className={`bi ${contactToEdit ? "bi-pencil" : "bi-check-circle"}`}></i>
                  {contactToEdit ? "Modifier" : "Enregistrer"}
            </button>

            <button
                type="button"
                style={{width: 200}}
                className="btn btn-secondary text-center d-flex justify-content-center"
                onClick={() => navigate(-1)}>
                Annuler
            </button>
        </div>
      </form>
    </div>
  )
}