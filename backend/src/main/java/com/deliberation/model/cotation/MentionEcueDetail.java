package com.deliberation.model.cotation;

import com.deliberation.dto.cotation.EcueDTO;
import com.deliberation.dto.cotation.MentionEcueDetailDTO;
import com.deliberation.model.ModelBase;
import com.deliberation.model.inscription.Inscription;
import com.deliberation.model.inscription.Mention;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;

import java.util.UUID;

@Entity
public class MentionEcueDetail extends ModelBase {
    @ManyToOne
    @JoinColumn(name = "mention_id")
    private Mention mention;

    @ManyToOne
    @JoinColumn(name = "ecue_id")
    private Ecue ecue;

    @ManyToOne
    @JoinColumn(name = "semestre_id")
    private Semestre semestre;

    private Integer noteAnnee;
    private Float credit;

    public Mention getMention() {
        return mention;
    }

    public void setMention(Mention mention) {
        this.mention = mention;
    }

    public Ecue getEcue() {
        return ecue;
    }

    public void setEcue(Ecue ecue) {
        this.ecue = ecue;
    }

    public Semestre getSemestre() {
        return semestre;
    }

    public void setSemestre(Semestre semestre) {
        this.semestre = semestre;
    }

    public Integer getNoteAnnee() {
        return noteAnnee;
    }

    public void setNoteAnnee(Integer noteAnnee) {
        this.noteAnnee = noteAnnee;
    }

    public Float getCredit() {
        return credit;
    }

    public void setCredit(Float credit) {
        this.credit = credit;
    }

    /****
     *
     * @param dto
     * @param mention
     * @param ecue
     * @param semestre
     */
    public void fromDTO(MentionEcueDetailDTO dto, Mention mention, Ecue ecue, Semestre semestre)
    {
        if (dto == null) return;

        setId(dto.id);
        setNoteAnnee(dto.noteAnnee);
        setCredit(dto.credit);

        if(mention != null)
            setMention(mention);

        if(ecue != null)
            setEcue(ecue);

        if(semestre != null)
            setSemestre(semestre);
    }
}