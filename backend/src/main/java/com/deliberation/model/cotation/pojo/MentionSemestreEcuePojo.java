package com.deliberation.model.cotation.pojo;

import com.deliberation.model.cotation.MentionSemestreEcueDetail;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Transient;

public class MentionSemestreEcuePojo {

    private MentionSemestreEcueDetail mentionSemestreEcueDetail;

    private EchecEcueProjection echec;

    private Boolean estCote;

    private Boolean allNotes;

    private long countManqueCote;

    private long countWithCote;

    public MentionSemestreEcueDetail getMentionSemestreEcueDetail() {
        return mentionSemestreEcueDetail;
    }

    public void setMentionSemestreEcueDetail(MentionSemestreEcueDetail mentionSemestreEcueDetail) {
        this.mentionSemestreEcueDetail = mentionSemestreEcueDetail;
    }

    public EchecEcueProjection getEchec() {
        return echec;
    }

    public void setEchec(EchecEcueProjection echec) {
        this.echec = echec;
    }

    public Boolean getEstCote() {
        return estCote;
    }

    public void setEstCote(Boolean estCote) {
        this.estCote = estCote;
    }

    public long getCountManqueCote() {
        return countManqueCote;
    }

    public void setCountManqueCote(long countManqueCote) {
        this.countManqueCote = countManqueCote;

        this.allNotes = countManqueCote == 0;
    }

    public long getCountWithCote() {

        return countWithCote;
    }

    public void setCountWithCote(long countWithCote) {
        this.countWithCote = countWithCote;

        estCote = countWithCote > 0;
    }

    public Boolean getAllNotes() {
        return allNotes;
    }

    public void setAllNotes(Boolean allNotes) {
        this.allNotes = allNotes;
    }
}
