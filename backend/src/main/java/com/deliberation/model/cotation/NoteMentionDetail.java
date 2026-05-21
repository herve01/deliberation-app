package com.deliberation.model.cotation;

import com.deliberation.dto.cotation.EcueDTO;
import com.deliberation.dto.cotation.NoteMentionDTO;
import com.deliberation.dto.cotation.NoteMentionDetailDTO;
import com.deliberation.model.ModelBase;
import com.deliberation.model.inscription.AnneeAcademique;
import com.deliberation.model.inscription.Inscription;
import com.deliberation.model.inscription.Mention;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;

import java.util.UUID;

@Entity
//@Table(name = "etudiant")
public class NoteMentionDetail extends ModelBase {

    @ManyToOne
    @JoinColumn(name = "note_id")
    private NoteMention noteMention;

    @ManyToOne
    @JoinColumn(name = "inscription_id")
    private Inscription inscription;

    @ManyToOne
    @JoinColumn(name = "ecue_id")
    private MentionEcueDetail ecue;

    private Float noteAnnuelle;
    private Float note;
    private Float credit;
    private Boolean estTransfere;

    public Inscription getInscription() {
        return inscription;
    }

    public void setInscription(Inscription inscription) {
        this.inscription = inscription;
    }

    public MentionEcueDetail getEcue() {
        return ecue;
    }

    public void setEcue(MentionEcueDetail ecue) {
        this.ecue = ecue;
    }

    public Float getNote() {
        return note;
    }

    public void setNote(Float note) {
        this.note = note;
    }

    public Float getNoteAnnuelle() {
        return noteAnnuelle;
    }

    public void setNoteAnnuelle(Float noteAnnuelle) {
        this.noteAnnuelle = noteAnnuelle;
    }

    public Float getCredit() {
        return credit;
    }

    public void setCredit(Float credit) {
        this.credit = credit;
    }

    public Boolean getEstTransfere() {
        return estTransfere;
    }

    public void setEstTransfere(Boolean estTransfere) {
        this.estTransfere = estTransfere;
    }

    public NoteMention getNoteMention() {
        return noteMention;
    }

    public void setNoteMention(NoteMention noteMention) {
        this.noteMention = noteMention;
    }

    /*****
     *
     * @param dto
     * @param inscription
     * @param ecue note_mention_detail
     */
    public void fromDTO(NoteMentionDetailDTO dto, NoteMention noteMention, Inscription inscription, MentionEcueDetail ecue)
    {
        if (dto == null) return;

        setId(dto.id);
        setNote(dto.note);
        setCredit(dto.credit);
        setNoteAnnuelle(dto.noteAnnuelle);
        setEstTransfere(dto.estTransfere);

        if(noteMention != null)
            setNoteMention(noteMention);

        if(inscription != null)
            setInscription(inscription);

        if(ecue != null)
            setEcue(ecue);
    }
}