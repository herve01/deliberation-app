package com.deliberation.model.deliberation.pojo;

import com.deliberation.model.deliberation.JuryMembreDetail;
import com.deliberation.model.inscription.AnneeAcademique;
import com.deliberation.model.inscription.Inscription;
import com.deliberation.model.inscription.Mention;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicReference;
import java.util.function.Function;
import java.util.stream.Collectors;

public class MembreJuryMentionPojo {

    private Mention mention;
    private AnneeAcademique annee;
    private List<JuryMembreDetail> details;

    public Mention getMention() {
        return mention;
    }

    public void setMention(Mention mention) {
        this.mention = mention;
    }

    public AnneeAcademique getAnnee() {
        return annee;
    }

    public void setAnnee(AnneeAcademique annee) {
        this.annee = annee;
    }

    public List<JuryMembreDetail> getDetails() {
        return details;
    }

    public void setDetails(List<JuryMembreDetail> details) {
        this.details = details;
    }
}