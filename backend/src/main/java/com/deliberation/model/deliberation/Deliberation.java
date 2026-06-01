package com.deliberation.model.deliberation;

import com.deliberation.dto.deliberation.DeliberationDTO;
import com.deliberation.model.ModelBase;
import com.deliberation.model.cotation.CotationDetail;
import com.deliberation.model.cotation.Semestre;
import com.deliberation.model.cotation.Session;
import com.deliberation.model.inscription.AnneeAcademique;
import com.deliberation.model.inscription.Mention;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
//@Table(name = "etudiant")
public class Deliberation extends ModelBase {
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

    /***
     *
     * @param dto
     * @param mention
     * @param semestre
     * @param annee
     * @param session
     */
    public void fromDTO(DeliberationDTO dto, Mention mention, Semestre semestre, AnneeAcademique annee, Session session)
    {
        if (dto == null) return;

        setId(dto.id);

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
    private List<DeliberationDetail> details = new ArrayList<>();

    public List<DeliberationDetail> getDetails() {
        return details;
    }

    public void setDetails(List<DeliberationDetail> details) {
        this.details = details;
    }
    public void add(DeliberationDetail detail) {
        this.details.add(detail);
    }
}