package com.deliberation.model.cotation;

import com.deliberation.dto.cotation.MentionEcueDetailDTO;
import com.deliberation.dto.cotation.NoteMentionDTO;
import com.deliberation.model.ModelBase;
import com.deliberation.model.inscription.AnneeAcademique;
import com.deliberation.model.inscription.Mention;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;

import java.util.UUID;

@Entity
//@Table(name = "etudiant")
public class NoteMention extends ModelBase {
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

    public void fromDTO(NoteMentionDTO dto, Mention mention, Semestre semestre, AnneeAcademique annee, Session session)
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
}