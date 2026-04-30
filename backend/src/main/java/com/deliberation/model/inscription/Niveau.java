package com.deliberation.model.inscription;

import com.deliberation.dto.inscription.MentionDTO;
import com.deliberation.dto.inscription.NiveauDTO;
import com.deliberation.model.ModelBase;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

import java.time.LocalDate;
import java.util.UUID;

@Entity
//@Table(name = "niveau")
public class Niveau extends ModelBase {
    private String intitule;
    private Integer ordre;

    public String getIntitule() {
        return intitule;
    }

    public void setIntitule(String intitule) {
        this.intitule = intitule;
    }

    public Integer getOrdre() {
        return ordre;
    }

    public void setOrdre(Integer ordre) {
        this.ordre = ordre;
    }

    public void fromDTO(NiveauDTO dto)
    {
        if (dto == null) return;

        setId(dto.id);
        setIntitule(dto.intitule);
        setOrdre(dto.ordre);
    }
}