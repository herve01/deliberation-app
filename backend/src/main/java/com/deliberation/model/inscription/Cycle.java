package com.deliberation.model.inscription;

import com.deliberation.dto.inscription.CycleDTO;
import com.deliberation.dto.inscription.DomaineDTO;
import com.deliberation.model.ModelBase;
import jakarta.persistence.Entity;

@Entity

public class Cycle extends ModelBase{
    private String intitule;
    private String description;
    private Integer ordre;

    public String getIntitule() {
        return intitule;
    }

    public void setIntitule(String intitule) {
        this.intitule = intitule;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getOrdre() {
        return ordre;
    }

    public void setOrdre(Integer ordre) {
        this.ordre = ordre;
    }

    public void fromDTO(CycleDTO dto)
    {
        if (dto == null) return;

        setId(dto.id);
        setIntitule(dto.intitule);
        setDescription(dto.description);
        setOrdre(dto.ordre);
    }
}