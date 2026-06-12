package com.deliberation.model.deliberation;

import com.deliberation.dto.deliberation.DeliberationDetailDTO;
import com.deliberation.model.ModelBase;
import com.deliberation.model.cotation.CotationDetail;
import com.deliberation.model.enums.MentionType;
import com.deliberation.model.inscription.Inscription;
import jakarta.persistence.*;

@Entity
@Table(name = "deliberation_detail")
public class DeliberationDetail extends ModelBase implements Cloneable {

    @ManyToOne
    @JoinColumn(name = "deliberation_id")
    private Deliberation deliberation;

    @ManyToOne
    @JoinColumn(name = "inscription_id")
    private Inscription inscription;

    private Float credits;
    private Float valides;
    private Float transferes;

    private Float moyenne;
    private Float total;

    private Boolean aEchoue;

    @Enumerated(EnumType.STRING)
    private MentionType decision;

    public Deliberation getDeliberation() {
        return deliberation;
    }

    public void setDeliberation(Deliberation deliberation) {
        this.deliberation = deliberation;
    }

    public Inscription getInscription() {
        return inscription;
    }

    public void setInscription(Inscription inscription) {
        this.inscription = inscription;
    }

    public Float getCredits() {
        return credits;
    }

    public void setCredits(Float credits) {
        this.credits = credits;
        recalculateTransferes();
    }

    public Float getValides() {
        return valides;
    }

    public void setValides(Float valides) {
        this.valides = valides;
        recalculateTransferes();
    }

    public Float getTransferes() {
        return transferes;
    }

    public void setTransferes(Float transferes) {
        this.transferes = transferes;
    }

    public Float getMoyenne() {
        return moyenne;
    }

    public void setMoyenne(Float moyenne) {
        this.moyenne = moyenne;

        if(getId() == null || getId().isBlank()) {
            setaEchoue(false);
            if (moyenne < 10) {
                decision = MentionType.DEFAILLANT;
                setaEchoue(true);
            } else if (moyenne < 12)
                decision = MentionType.PASSABLE;
            else if (moyenne < 14)
                decision = MentionType.ASSEZ_BIEN;
            else if (moyenne < 16)
                decision = MentionType.BIEN;
            else if (moyenne < 18)
                decision = MentionType.TRES_BIEN;
            else
                decision = MentionType.EXCELLENT;
        }
    }

    public MentionType getDecision() {
        return decision;
    }

    public void setDecision(MentionType decision) {
        this.decision = decision;
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

    @Override
    public DeliberationDetail clone() {
        try {
            return (DeliberationDetail) super.clone();
        } catch (CloneNotSupportedException e) {
            throw new RuntimeException("Erreur lors du clonage de DeliberationDetail", e);
        }
    }

    /***
     *
     * @param dto
     * @param deliberation
     * @param inscription
     */
    public void fromDTO(DeliberationDetailDTO dto, Deliberation deliberation, Inscription inscription)
    {
        if (dto == null) return;

        setId(dto.id);
        setCredits(dto.credits);
        setValides(dto.valides);
        setTransferes(dto.transferes);
        setMoyenne(dto.moyenne);
        setTotal(dto.total);
        setaEchoue(dto.aEchoue);
        setDecision(dto.decision);

        if(deliberation != null)
            setDeliberation(deliberation);

        if(inscription != null)
            setInscription(inscription);

    }

    private void recalculateTransferes() {
        if(!(getId() == null || getId().isBlank()))
            return;

        float c = credits != null ? credits : 0F;
        float v = valides != null ? valides : 0F;
        this.transferes = c - v;
    }
}