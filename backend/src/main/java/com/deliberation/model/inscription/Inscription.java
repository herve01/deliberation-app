package com.deliberation.model.inscription;

import com.deliberation.dto.inscription.InscriptionDTO;
import com.deliberation.model.ModelBase;
import com.deliberation.model.cotation.CotationDetail;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "inscription")
public class Inscription extends ModelBase {
    @ManyToOne
    @JoinColumn(name = "etudiant_id")
    private Etudiant etudiant;

    @ManyToOne
    @JoinColumn(name = "annee_id")
    private AnneeAcademique annee;

    @ManyToOne
    @JoinColumn(name = "mention_id")
    private Mention mention;

    @Column(name = "est_nouvelle")
    private Boolean estNouvelle;

    @Lob
    @Basic(fetch = FetchType.LAZY)
    @Column(name = "photo", columnDefinition = "TEXT", nullable = true)
    private String photo;

    private LocalDateTime date;

    public Etudiant getEtudiant() {
        return etudiant;
    }

    public void setEtudiant(Etudiant etudiant) {
        this.etudiant = etudiant;
    }

    public AnneeAcademique getAnnee() {
        return annee;
    }

    public void setAnnee(AnneeAcademique annee) {
        this.annee = annee;
    }

    public Mention getMention() {
        return mention;
    }

    public void setMention(Mention mention) {
        this.mention = mention;
    }

    public Boolean getEstNouvelle() {
        return estNouvelle;
    }

    public void setEstNouvelle(Boolean estNouvelle) {
        this.estNouvelle = estNouvelle;
    }

    public String getPhoto() {
        return photo;
    }

    public void setPhoto(String photo) {
        this.photo = photo;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }

    private LocalDateTime dateArret;

    public LocalDateTime getDateArret() {
        return dateArret;
    }

    public void setDateArret(LocalDateTime dateArret) {
        this.dateArret = dateArret;
    }

    /***
     *
     * @param dto
     * @param etudiant
     * @param annee
     * @param mention
     */
    public void fromDTO(InscriptionDTO dto, Etudiant etudiant, AnneeAcademique annee, Mention mention)
    {
        if (dto == null) return;

        setId(dto.id);
        setEstNouvelle(dto.estNouvelle);
        setDate(dto.date);

        if(dto.photo != null)
            setPhoto(dto.photo);

        if(dto.dateArret != null)
            setDateArret(dto.dateArret);

        if(etudiant != null)
            setEtudiant(etudiant);

        if(annee != null)
            setAnnee(annee);

        if(mention != null)
            setMention(mention);
    }
}