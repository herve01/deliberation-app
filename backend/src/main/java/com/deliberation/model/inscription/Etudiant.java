package com.deliberation.model.inscription;

import com.deliberation.dto.inscription.EtudiantDTO;
import com.deliberation.model.ModelBase;
import com.deliberation.model.setting.Pays;
import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
public class Etudiant extends ModelBase {
    private String matricule;
    private String nom;
    private String postnom;
    private String prenom;
    private String sexe;

    @ManyToOne
    @JoinColumn(name = "pays_naissance_id")
    private Pays paysNaissance;

    @Column(name = "lieu_naissance")
    private String lieuNaissance;

    @Column(name = "date_naissance")
    private java.time.LocalDate dateNaissance;

    private String telephone;

    public String getMatricule() {
        return matricule;
    }

    public void setMatricule(String matricule) {
        this.matricule = matricule;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getPostnom() {
        return postnom;
    }

    public void setPostnom(String postnom) {
        this.postnom = postnom;
    }

    public String getPrenom() {
        return prenom;
    }

    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }

    public String getSexe() {
        return sexe;
    }

    public void setSexe(String sexe) {
        this.sexe = sexe;
    }

    public Pays getPaysNaissance() {
        return paysNaissance;
    }

    public void setPaysNaissance(Pays paysNaissance) {
        this.paysNaissance = paysNaissance;
    }

    public String getLieuNaissance() {
        return lieuNaissance;
    }

    public void setLieuNaissance(String lieuNaissance) {
        this.lieuNaissance = lieuNaissance;
    }

    public LocalDate getDateNaissance() {
        return dateNaissance;
    }

    public void setDateNaissance(LocalDate dateNaissance) {
        this.dateNaissance = dateNaissance;
    }

    public String getTelephone() {
        return telephone;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }

    /***
     *
     * @param dto
     * @param pays
     */
    public void fromDTO(EtudiantDTO dto, Pays pays)
    {
        if (dto == null) return;

        setId(dto.id);
        setMatricule(dto.matricule);
        setNom(dto.nom);
        setPostnom(dto.postnom);
        setPrenom(dto.prenom);
        setSexe(dto.sexe);
        setLieuNaissance(dto.lieuNaissance);
        setDateNaissance(dto.dateNaissance);
        setTelephone(dto.telephone);

        if(pays != null)
            setPaysNaissance(pays);
    }
}