package com.deliberation.model.cotation;

import com.deliberation.dto.cotation.CotationDTO;
import com.deliberation.model.ModelBase;
import com.deliberation.model.deliberation.DeliberationDetail;
import com.deliberation.model.inscription.AnneeAcademique;
import com.deliberation.model.inscription.Mention;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
//@Table(name = "etudiant")
public class Cotation extends ModelBase {
    @ManyToOne
    @JoinColumn(name = "mention_id")
    private Mention mention;

    @ManyToOne
    @JoinColumn(name = "semestre_id")
    private Semestre semestre;

    @ManyToOne
    @JoinColumn(name = "annee_id")
    private AnneeAcademique annee;

    @ManyToOne
    @JoinColumn(name = "session_id")
    private Session session;

    @Column(name = "est_cotation_annuelle")
    private Boolean estCotationAnnuelle;

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

    public Session getSession() {
        return session;
    }

    public void setSession(Session session) {
        this.session = session;
    }

    public Boolean getEstCotationAnnuelle() {
        return estCotationAnnuelle;
    }

    public void setEstCotationAnnuelle(Boolean estCotationAnnuelle) {
        this.estCotationAnnuelle = estCotationAnnuelle;
    }

    public Cotation() {
        //this.details = new ArrayList<>();
    }

    public void fromDTO(CotationDTO dto, Mention mention, Semestre semestre, AnneeAcademique annee, Session session)
    {
        if (dto == null) return;

        setId(dto.id);
        setEstCotationAnnuelle(dto.estCotationAnnuelle);

        if(mention != null)
            setMention(mention);

        if(semestre != null)
            setSemestre(semestre);

        if(annee != null)
            setAnnee(annee);

        if(session != null)
            setSession(session);
    }

    @Transient
    @JsonManagedReference
    private List<CotationDetail> details = new ArrayList<>();

    public List<CotationDetail> getDetails() {
        return details;
    }

    public void setDetails(List<CotationDetail> details) {
        this.details = details;
    }

    public void add(CotationDetail detail) {
        this.details.add(detail);
    }
}