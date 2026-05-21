package com.deliberation.model.deliberation;

import com.deliberation.dto.deliberation.PersonnelAffectationMentionEcueDTO;
import com.deliberation.model.ModelBase;
import com.deliberation.model.cotation.MentionEcueDetail;
import com.deliberation.model.inscription.AnneeAcademique;
import jakarta.persistence.*;

@Entity
//@Table(name = "personnel_affectation_mention_ecue")
public class PersonnelAffectationMentionEcue extends ModelBase {

    @ManyToOne
    @JoinColumn(name = "personnel_id")
    private Personnel personnel;

    @ManyToOne
    @JoinColumn(name = "ecue_id")
    private MentionEcueDetail ecue;

    @ManyToOne
    @JoinColumn(name = "annee_id")
    private AnneeAcademique annee;

    public Personnel getPersonnel() {
        return personnel;
    }

    public void setPersonnel(Personnel personnel) {
        this.personnel = personnel;
    }

    public MentionEcueDetail getEcue() {
        return ecue;
    }

    public void setEcue(MentionEcueDetail ecue) {
        this.ecue = ecue;
    }

    public AnneeAcademique getAnnee() {
        return annee;
    }

    public void setAnnee(AnneeAcademique annee) {
        this.annee = annee;
    }

    /**
     * Mapping DTO -> Entity (optionnel)
     */
    public void fromDTO(
            PersonnelAffectationMentionEcueDTO dto,
            Personnel personnel,
            MentionEcueDetail ecue,
            AnneeAcademique annee
    ) {
        if (dto == null) return;

        setId(dto.id);

        if (personnel != null) {
            setPersonnel(personnel);
        }

        if (ecue != null) {
            setEcue(ecue);
        }

        if (annee != null) {
            setAnnee(annee);
        }
    }
}