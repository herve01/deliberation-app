package com.deliberation.model.deliberation;

import com.deliberation.dto.deliberation.JuryMembreDetailDTO;
import com.deliberation.model.ModelBase;
import com.deliberation.model.enums.JuryRole;
import com.deliberation.model.inscription.AnneeAcademique;
import com.deliberation.model.inscription.Mention;
import jakarta.persistence.*;

@Entity
//@Table(name = "etudiant")
public class JuryMembreDetail extends ModelBase {

    @ManyToOne
    @JoinColumn(name = "mention_id")
    private Mention mention;

    @ManyToOne
    @JoinColumn(name = "personnel_id")
    private Personnel personnel;

    @ManyToOne
    @JoinColumn(name = "annee_id")
    private AnneeAcademique annee;

    @Enumerated(EnumType.STRING)
    private JuryRole role;

    public Mention getMention() {
        return mention;
    }

    public void setMention(Mention mention) {
        this.mention = mention;
    }

    public Personnel getPersonnel() {
        return personnel;
    }

    public void setPersonnel(Personnel personnel) {
        this.personnel = personnel;
    }

    public AnneeAcademique getAnnee() {
        return annee;
    }

    public void setAnnee(AnneeAcademique annee) {
        this.annee = annee;
    }

    public JuryRole getRole() {
        return role;
    }

    public void setRole(JuryRole role) {
        this.role = role;
    }

    /***
     *
     * @param dto
     * @param personnel
     * @param annee
     */
    public void fromDTO(JuryMembreDetailDTO dto, Mention mention, Personnel personnel, AnneeAcademique annee)
    {
        if (dto == null) return;

        setId(dto.id);
        setRole(dto.role);

        if(mention != null)
            setMention(mention);

        if(personnel != null)
            setPersonnel(personnel);

        if(annee != null)
            setAnnee(annee);
    }
}