package com.deliberation.model.inscription;

import com.deliberation.dto.inscription.AnneeAcademiqueDTO;
import com.deliberation.dto.inscription.DomaineDTO;
import com.deliberation.model.ModelBase;
import jakarta.persistence.Entity;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

import java.util.UUID;

@Entity
@Table(name = "domaine")
public class Domaine extends ModelBase{
    private String intitule;

    public String getIntitule() {
        return intitule;
    }

    public void setIntitule(String intitule) {
        this.intitule = intitule;
    }

    public void fromDTO(DomaineDTO dto)
    {
        if (dto == null) return;

        setId(dto.id);
        setIntitule(dto.intitule);
    }
}