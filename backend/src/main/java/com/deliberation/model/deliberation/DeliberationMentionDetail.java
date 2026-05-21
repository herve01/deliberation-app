package com.deliberation.model.deliberation;

import com.deliberation.dto.deliberation.DeliberationMentionDTO;
import com.deliberation.dto.deliberation.DeliberationMentionDetailDTO;
import com.deliberation.model.ModelBase;
import com.deliberation.model.cotation.Semestre;
import com.deliberation.model.cotation.Session;
import com.deliberation.model.enums.MentionType;
import com.deliberation.model.inscription.AnneeAcademique;
import com.deliberation.model.inscription.Inscription;
import com.deliberation.model.inscription.Mention;
import jakarta.persistence.*;

import java.util.UUID;

@Entity
//@Table(name = "etudiant")
public class DeliberationMentionDetail extends ModelBase {
    @ManyToOne
    @JoinColumn(name = "inscription_id")
    private Inscription inscription;

    @ManyToOne
    @JoinColumn(name = "deliberation_id")
    private DeliberationMention deliberation;

    private Float pourcentage;
    private Float note;
    private Float total;
    private Boolean aEchoue;

    @Enumerated(EnumType.STRING)
    private MentionType mention;

    public Inscription getInscription() {
        return inscription;
    }

    public void setInscription(Inscription inscription) {
        this.inscription = inscription;
    }

    public Float getPourcentage() {
        return pourcentage;
    }

    public void setPourcentage(Float pourcentage) {
        this.pourcentage = pourcentage;
    }

    public Float getNote() {
        return note;
    }

    public void setNote(Float note) {
        this.note = note;
    }

    public Float getTotal() {
        return total;
    }

    public void setTotal(Float total) {
        this.total = total;
    }

    public Boolean getaEchoue() {
        return aEchoue;
    }

    public void setaEchoue(Boolean aEchoue) {
        this.aEchoue = aEchoue;
    }

    public MentionType getMention() {
        return mention;
    }

    public void setMention(MentionType mention) {
        this.mention = mention;
    }

    public DeliberationMention getDeliberation() {
        return deliberation;
    }

    public void setDeliberation(DeliberationMention deliberation) {
        this.deliberation = deliberation;
    }

    /***
     *
     * @param dto
     * @param inscription
     */
    public void fromDTO(DeliberationMentionDetailDTO dto, DeliberationMention deliberation, Inscription inscription)
    {
        if (dto == null) return;

        setId(dto.id);
        setPourcentage(dto.pourcentage);
        setNote(dto.note);
        setTotal(dto.total);
        setaEchoue(dto.aEchoue);
        setMention(dto.mention);

        if(deliberation != null)
            setDeliberation(deliberation);

        if(inscription != null)
            setInscription(inscription);

    }
}