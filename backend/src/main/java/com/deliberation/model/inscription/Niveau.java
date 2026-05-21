package com.deliberation.model.inscription;

import com.deliberation.dto.inscription.CycleDTO;
import com.deliberation.dto.inscription.MentionDTO;
import com.deliberation.dto.inscription.NiveauDTO;
import com.deliberation.model.ModelBase;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
//@Table(name = "niveau")
public class Niveau extends ModelBase {
    private String intitule;
    private Integer ordre;

    @Column(name = "is_old_system")
    private Boolean isOldSystem;

    @ManyToOne
    @JoinColumn(name = "cycle_id")
    private Cycle cycle;

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

    public Boolean getOldSystem() {
        return isOldSystem;
    }

    public void setOldSystem(Boolean isOld) {
        isOldSystem = isOld;
    }

    public Cycle getCycle() {
        return cycle;
    }

    public void setCycle(Cycle cycle) {
        this.cycle = cycle;
    }

    public void fromDTO(NiveauDTO dto, Cycle cycle)
    {
        if (dto == null) return;

        setId(dto.id);
        setIntitule(dto.intitule);
        setOrdre(dto.ordre);
        setOldSystem(dto.oldSystem);

        if(cycle != null)
            setCycle(cycle);
    }
}