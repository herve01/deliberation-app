package com.deliberation.model.cotation;

import com.deliberation.dto.cotation.MentionSemestreEcueDTO;
import com.deliberation.dto.cotation.MentionSemestreEcueDetailDTO;
import com.deliberation.model.ModelBase;
import com.deliberation.model.inscription.AnneeAcademique;
import com.deliberation.model.inscription.Mention;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Transient;

import java.util.ArrayList;
import java.util.List;

@Entity
public class MentionSemestreEcue extends ModelBase {

    @ManyToOne
    @JoinColumn(name = "mention_id")
    private Mention mention;

    @ManyToOne
    @JoinColumn(name = "semestre_id")
    private Semestre semestre;

    @ManyToOne
    @JoinColumn(name = "annee_id")
    private AnneeAcademique annee;

    public Mention getMention() {
        return mention;
    }

    public void setMention(Mention mention) {
        this.mention = mention;
    }

    public Semestre getSemestre() {
        return semestre;
    }

    public void setSemestre(Semestre semestre) {
        this.semestre = semestre;
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
     * @param mention
     * @param semestre
     * @param annee
     */
    public void fromDTO(MentionSemestreEcueDTO dto, Mention mention, Semestre semestre, AnneeAcademique annee)
    {
        if (dto == null) return;

        setId(dto.id);

        if(mention != null)
            setMention(mention);

        if(semestre != null)
            setSemestre(semestre);

        if(annee != null)
            setAnnee(annee);
    }

    @Transient
    @JsonManagedReference
    private List<MentionSemestreEcueDetail> details = new ArrayList<>();

    public List<MentionSemestreEcueDetail> getDetails() {
        return details;
    }

    public void setDetails(List<MentionSemestreEcueDetail> details) {
        this.details = details;
    }

    public void add(MentionSemestreEcueDetail detail) {
        this.details.add(detail);
    }
}