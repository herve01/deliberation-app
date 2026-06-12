package com.deliberation.model.cotation;

import com.deliberation.dto.cotation.CotationDetailDTO;
import com.deliberation.model.ModelBase;
import com.deliberation.model.inscription.Inscription;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
@Table(name = "cotation_detail")
public class CotationDetail extends ModelBase implements Cloneable {

    @ManyToOne
    @JoinColumn(name = "cotation_id")
    @JsonBackReference
    private Cotation cotation;

    @ManyToOne
    @JoinColumn(name = "inscription_id")
    private Inscription inscription;

    @ManyToOne
    @JoinColumn(name = "mention_semestre_ecue_id")
    private MentionSemestreEcueDetail mentionSemestreEcue;

    @Column(name = "note")
    private Float note;

    @Column(name = "credit")
    private Float credit;

    @Column(name = "est_note_annuelle")
    private Boolean estNoteAnnuelle;

    @Column(name = "est_valide")
    private Boolean estValide;

    @Column(name = "est_transfere")
    private Boolean estTransfere;

    @Column(name = "est_valide_transfert")
    private Boolean estValideTransfert;

    // =========================
    // GETTERS & SETTERS
    // =========================

    public Inscription getInscription() {
        return inscription;
    }

    public void setInscription(Inscription inscription) {
        this.inscription = inscription;
    }

    public MentionSemestreEcueDetail getMentionSemestreEcue() {
        return mentionSemestreEcue;
    }

    public void setMentionSemestreEcue(MentionSemestreEcueDetail mentionSemestreEcue) {
        this.mentionSemestreEcue = mentionSemestreEcue;
    }

    public Float getNote() {
        return note;
    }

    public void setNote(Float note) {
        this.note = note;
    }

    public Float getCredit() {
        return credit;
    }

    public void setCredit(Float credit) {
        this.credit = credit;
    }

    public Boolean getEstNoteAnnuelle() {
        return estNoteAnnuelle;
    }

    public void setEstNoteAnnuelle(Boolean estNoteAnnuelle) {
        this.estNoteAnnuelle = estNoteAnnuelle;
    }

    public Boolean getEstTransfere() {
        return estTransfere;
    }

    public void setEstTransfere(Boolean estTransfere) {
        this.estTransfere = estTransfere;
    }

    public Cotation getCotation() {
        return cotation;
    }

    public void setCotation(Cotation cotation) {
        this.cotation = cotation;
    }

    public Boolean getEstValide() {
        return estValide;
    }

    public void setEstValide(Boolean estValide) {
        this.estValide = estValide;
    }

    public Boolean getEstValideTransfert() {
        return estValideTransfert;
    }

    public void setEstValideTransfert(Boolean estValideTransfert) {
        this.estValideTransfert = estValideTransfert;
    }

    // =========================
    // CLONE
    // =========================

    @Override
    public CotationDetail clone() {
        try {
            return (CotationDetail) super.clone();
        } catch (CloneNotSupportedException e) {
            throw new RuntimeException("Erreur lors du clonage de CotationDetail", e);
        }
    }

    // =========================
    // DTO
    // =========================

    public void fromDTO(CotationDetailDTO dto, Cotation cotation, Inscription inscription, MentionSemestreEcueDetail mentionSemestreEcue) {
        if (dto == null) return;

        setId(dto.id);
        setNote(dto.note);
        setCredit(dto.credit);
        setEstNoteAnnuelle(dto.estNoteAnnuelle);
        setEstValide(dto.estValide);
        setEstTransfere(dto.estTransfere);
        setEstValideTransfert(dto.estValideTransfert);

        if (cotation != null)
            setCotation(cotation);

        if (inscription != null)
            setInscription(inscription);

        if (mentionSemestreEcue != null)
            setMentionSemestreEcue(mentionSemestreEcue);
    }
}