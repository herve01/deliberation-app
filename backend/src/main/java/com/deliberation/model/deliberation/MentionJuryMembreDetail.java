package com.deliberation.model.deliberation;

import com.deliberation.dto.deliberation.JuryMembreDTO;
import com.deliberation.dto.deliberation.MentionJuryMembreDetailDTO;
import com.deliberation.model.ModelBase;
import com.deliberation.model.enums.JuryRole;
import com.deliberation.model.inscription.AnneeAcademique;
import com.deliberation.model.setting.Pays;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.UUID;

@Entity
//@Table(name = "etudiant")
public class MentionJuryMembreDetail extends ModelBase {
    @ManyToOne
    @JoinColumn(name = "jury_id")
    private JuryMembre jury;

    @Enumerated(EnumType.STRING)
    private JuryRole role;

    @ManyToOne
    @JoinColumn(name = "annee_id")
    private AnneeAcademique annee;

    public JuryMembre getJury() {
        return jury;
    }

    public void setJury(JuryMembre jury) {
        this.jury = jury;
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
     * @param jury
     * @param annee
     */
    public void fromDTO(MentionJuryMembreDetailDTO dto, JuryMembre jury, AnneeAcademique annee)
    {
        if (dto == null) return;

        setId(dto.id);
        setRole(dto.role);

        if(jury != null)
            setJury(jury);

        if(annee != null)
            setAnnee(annee);
    }
}