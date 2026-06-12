package com.deliberation.model.inscription;

import com.deliberation.dto.inscription.FiliereDTO;
import com.deliberation.model.ModelBase;
import jakarta.persistence.*;

@Entity
@Table(name = "filiere")
public class Filiere extends ModelBase {
    private String intitule;

    @Column(name = "is_old_system")
    private Boolean isOldSystem;

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

    public Boolean getOldSystem() {
        return isOldSystem;
    }

    public void setOldSystem(Boolean oldSystem) {
        isOldSystem = oldSystem;
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
        setOldSystem(dto.isOldSystem);

        if(domaine != null)
            setDomaine(domaine);
    }
}