// src/shared/validators.js
import { REGEX } from "./regex"

export const isValidEmail = (email) => REGEX.EMAIL.test(email)
export const isValidPhone = (phone) => REGEX.PHONE.test(phone)
export const isStrongPassword = (pwd) => REGEX.PASSWORD.test(pwd)
export const isValidName = (nom) => REGEX.NAME.test(nom)

export function isFormValid(form) {
  return (
    isValidName(form.nom) &&
    isValidName(form.prenom) &&
    isValidPhone(form.telephone) &&
    (!form.email || isValidEmail(form.email))
  )
}

export function isFormUserValid(form) {
  return (
    isValidName(form.nom) &&
    (!form.email || isValidEmail(form.email))
  )
}