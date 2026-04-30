package com.deliberation.model.inscription;

import com.deliberation.dto.deliberation.MentionJuryMembreDetailDTO;
import com.deliberation.dto.inscription.AnneeAcademiqueDTO;
import com.deliberation.model.ModelBase;
import com.deliberation.model.deliberation.JuryMembre;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

import java.time.LocalDate;
import java.util.UUID;

@Entity
//@Table(name = "annee_academique")

public class AnneeAcademique extends ModelBase {

    @Column(unique = true)
    private String annee;

    @Column(name = "date_ouverture")
    private LocalDate dateOuverture;

    @Column(name = "date_cloture")
    private LocalDate dateCloture;

    public String getAnnee() {
        return annee;
    }

    public void setAnnee(String annee) {
        this.annee = annee;
    }

    public LocalDate getDateOuverture() {
        return dateOuverture;
    }

    public void setDateOuverture(LocalDate dateOuverture) {
        this.dateOuverture = dateOuverture;
    }

    public LocalDate getDateCloture() {
        return dateCloture;
    }

    public void setDateCloture(LocalDate dateCloture) {
        this.dateCloture = dateCloture;
    }

    public void fromDTO(AnneeAcademiqueDTO dto)
    {
        if (dto == null) return;

        setId(dto.id);
        setAnnee(dto.annee);
        setDateOuverture(dto.dateOuverture);
        setDateCloture(dto.dateCloture);
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;

        AnneeAcademique instance = (AnneeAcademique) obj;
        return getId() != null && getId().equals(instance.getId());
    }

    @Override
    public int hashCode() {
        return getId() != null ? getId().hashCode() : 0;
    }
}