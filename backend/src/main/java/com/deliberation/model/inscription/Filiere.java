package com.deliberation.model.inscription;

import com.deliberation.dto.deliberation.MentionJuryMembreDetailDTO;
import com.deliberation.dto.inscription.FiliereDTO;
import com.deliberation.model.ModelBase;
import com.deliberation.model.deliberation.JuryMembre;
import jakarta.persistence.*;

import java.util.UUID;

@Entity
//@Table(name = "filiere")
public class Filiere extends ModelBase {
    private String intitule;

    @ManyToOne
    @JoinColumn(name = "domaine_id")
    private Domaine domaine;

    public String getIntitule() {
        return intitule;
    }

    public void setIntitule(String intitule) {
        this.intitule = intitule;
    }

    public Domaine getDomaine() {
        return domaine;
    }

    public void setDomaine(Domaine domaine) {
        this.domaine = domaine;
    }

    /***
     *
     * @param dto
     * @param domaine
     */
    public void fromDTO(FiliereDTO dto, Domaine domaine)
    {
        if (dto == null) return;

        setId(dto.id);
        setIntitule(dto.intitule);

        if(domaine != null)
            setDomaine(domaine);
    }
}