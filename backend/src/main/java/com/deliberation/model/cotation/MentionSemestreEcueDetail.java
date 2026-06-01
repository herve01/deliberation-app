package com.deliberation.model.cotation;

import com.deliberation.dto.cotation.MentionSemestreEcueDetailDTO;
import com.deliberation.model.ModelBase;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

@Entity
public class MentionSemestreEcueDetail extends ModelBase {

    @ManyToOne
    @JoinColumn(name = "mention_semestre_id")
    @JsonBackReference
    private MentionSemestreEcue mentionSemestre;

    @ManyToOne
    @JoinColumn(name = "categorie_id")
    private Categorie categorie;

    @ManyToOne
    @JoinColumn(name = "ecue_id")
    private Ecue ecue;

    @Column(name = "maxima")
    private Integer maxima;

    private Float credit;

    @Column(name = "est_cote_annuel")
    private Boolean estCoteAnnuel;

    public Categorie getCategorie() {
        return categorie;
    }

    public MentionSemestreEcue getMentionSemestre() {
        return mentionSemestre;
    }

    public void setMentionSemestre(MentionSemestreEcue mentionSemestre) {
        this.mentionSemestre = mentionSemestre;
    }

    public void setCategorie(Categorie categorie) {
        this.categorie = categorie;
    }

    public Ecue getEcue() {
        return ecue;
    }

    public void setEcue(Ecue ecue) {
        this.ecue = ecue;
    }

    public Integer getMaxima() {
        return maxima;
    }

    public void setMaxima(Integer maxima) {
        this.maxima = maxima;
    }

    public Float getCredit() {
        return credit;
    }

    public void setCredit(Float credit) {
        this.credit = credit;
    }

    public Boolean getEstCoteAnnuel() {
        return estCoteAnnuel;
    }

    public void setEstCoteAnnuel(Boolean estCoteAnnuel) {
        this.estCoteAnnuel = estCoteAnnuel;
    }

    public void fromDTO(MentionSemestreEcueDetailDTO dto, MentionSemestreEcue mention, Categorie categorie, Ecue ecue)
    {
        if (dto == null) return;

        setId(dto.id);
        setMaxima(dto.maxima);
        setCredit(dto.credit);
        setEstCoteAnnuel(dto.estCoteAnnuel);

        if(categorie != null)
            setCategorie(categorie);

        if(mention != null)
            setMentionSemestre(mention);

        if(ecue != null)
            setEcue(ecue);
    }

    @JsonProperty(value = "ecueName", access = JsonProperty.Access.READ_ONLY)
    public String getEcueName()
    {
        return String.format("%s", getEcue().getIntitule());
    }

}