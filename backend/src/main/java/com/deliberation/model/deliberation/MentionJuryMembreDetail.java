package com.deliberation.model.deliberation;

import com.deliberation.dto.deliberation.MentionJuryMembreDetailDTO;
import com.deliberation.model.ModelBase;
import com.deliberation.model.enums.JuryRole;
import com.deliberation.model.inscription.AnneeAcademique;
import jakarta.persistence.*;

@Entity
//@Table(name = "etudiant")
public class MentionJuryMembreDetail extends ModelBase {
    @ManyToOne
    @JoinColumn(name = "personnel_id")
    private Personnel personnel;

    @Enumerated(EnumType.STRING)
    private JuryRole role;

    @ManyToOne
    @JoinColumn(name = "annee_id")
    private AnneeAcademique annee;

    public Personnel getPersonnel() {
        return personnel;
    }

    public void setPersonnel(Personnel personnel) {
        this.personnel = personnel;
    }

    public JuryRole getRole() {
        return role;
    }

    public void setRole(JuryRole role) {
        this.role = role;
    }

    public AnneeAcademique getAnnee() {
        return annee;
    }

    public void setAnnee(AnneeAcademique annee) {
        this.annee = annee;
    }

    /***
     *
     * @param dto
     * @param personnel
     * @param annee
     */
    public void fromDTO(MentionJuryMembreDetailDTO dto, Personnel personnel, AnneeAcademique annee)
    {
        if (dto == null) return;

        setId(dto.id);
        setRole(dto.role);

        if(personnel != null)
            setPersonnel(personnel);

        if(annee != null)
            setAnnee(annee);
    }
}