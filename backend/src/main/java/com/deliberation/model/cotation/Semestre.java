package com.deliberation.model.cotation;

import com.deliberation.dto.cotation.NoteMentionDTO;
import com.deliberation.dto.cotation.SemestreDTO;
import com.deliberation.model.ModelBase;
import com.deliberation.model.inscription.AnneeAcademique;
import com.deliberation.model.inscription.Mention;
import com.deliberation.model.inscription.Niveau;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.UUID;

@Entity
//@Table(name = "etudiant")
public class Semestre extends ModelBase {
    @ManyToOne
    @JoinColumn(name = "niveau_id")
    private Niveau niveau;

    private String intitule;
    private Integer ordre;

    public Niveau getNiveau() {
        return niveau;
    }

    public void setNiveau(Niveau niveau) {
        this.niveau = niveau;
    }

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

    public void fromDTO(SemestreDTO dto, Niveau niveau)
    {
        if (dto == null) return;

        setId(dto.id);
        setIntitule(dto.intitule);
        setOrdre(dto.ordre);

        if(niveau != null)
            setNiveau(niveau);

    }
}