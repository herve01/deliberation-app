package com.deliberation.model.deliberation.pojo;

import com.deliberation.model.cotation.CotationDetail;
import com.deliberation.model.cotation.MentionSemestreEcueDetail;
import com.deliberation.model.deliberation.DeliberationDetail;
import com.deliberation.model.inscription.Inscription;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Objects;

import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

public class DeliberationMentionPojo {

    private Inscription inscription;

    private List<MentionSemestreEcueDetail> mentionSemestreEcueDetails;
    private List<CotationDetail> annuels;
    private List<CotationDetail> examens;
    private List<CotationDetail> totals;

    private TransfertNotePojo transfertNote;

    public DeliberationMentionPojo() {
        transfertNote = new TransfertNotePojo(){
            @Override
            public void setInscriptionId(String inscriptionId) {
                super.setInscriptionId(inscriptionId);
            }
        };
        deliberation = new DeliberationDetail(){
            @Override
            public void setInscription(Inscription inscription) {
                super.setInscription(inscription);
            }
        };
    }

    private DeliberationDetail deliberation = new DeliberationDetail();

    private Float credits;
    private Float valides;
    private Float moyenne;

    private String decision;

    public Inscription getInscription() {
        return inscription;
    }

    public void setInscription(Inscription inscription) {
        this.inscription = inscription;
        //deliberation.setInscription(inscription);
    }

    public List<MentionSemestreEcueDetail> getMentionSemestreEcueDetails() {
        return mentionSemestreEcueDetails;
    }

    public void setMentionSemestreEcueDetails(List<MentionSemestreEcueDetail> mentionSemestreEcueDetails) {
        this.mentionSemestreEcueDetails = mentionSemestreEcueDetails;
    }

    public List<CotationDetail> getAnnuels() {
        return annuels;
    }

    public void setAnnuels(List<CotationDetail> annuels) {
        this.annuels = annuels;
        refreshTotals();
    }

    public List<CotationDetail> getExamens() {
        return examens;
    }

    public void setExamens(List<CotationDetail> examens) {
        this.examens = examens;
        refreshTotals();
    }

    public List<CotationDetail> getTotals() {
        return totals;
    }

    public Float getCredits() {
        return credits;
    }

    public void setCredits(Float credits) {
        this.credits = credits;
    }

    public Float getValides() {
        return valides;
    }

    public void setValides(Float valides) {
        this.valides = valides;
    }

    public Float getMoyenne() {
        return moyenne;
    }

    public void setMoyenne(Float moyenne) {
        this.moyenne = moyenne;
    }

    public String getDecision() {
        return decision;
    }

    public void setDecision(String decision) {
        this.decision = decision;
    }

    public DeliberationDetail getDeliberation() {
        return deliberation;
    }

    public void setDeliberation(DeliberationDetail deliberation) {
        this.deliberation = deliberation;
    }

    public TransfertNotePojo getTransfertNote() {
        return transfertNote;
    }

    public void setTransfertNote(TransfertNotePojo transfertNote) {
        this.transfertNote = transfertNote;
    }

    private void refreshTotals() {
        if (mentionSemestreEcueDetails == null || mentionSemestreEcueDetails.isEmpty()) {
            totals = List.of();
            setMoyenne(0F);
            return;
        }

        var annuelsSafe = annuels != null ? annuels : List.<CotationDetail>of();
        var examensSafe = examens != null ? examens : List.<CotationDetail>of();

        Map<String, CotationDetail> annuelsMap = annuelsSafe.stream()
                .filter(a -> a.getMentionSemestreEcue() != null
                        && a.getMentionSemestreEcue().getId() != null)
                .collect(Collectors.toMap(
                        a -> a.getMentionSemestreEcue().getId(),
                        Function.identity(),
                        (a, b) -> a
                ));

        Map<String, CotationDetail> examensMap = examensSafe.stream()
                .filter(e -> e.getMentionSemestreEcue() != null
                        && e.getMentionSemestreEcue().getId() != null)
                .collect(Collectors.toMap(
                        e -> e.getMentionSemestreEcue().getId(),
                        Function.identity(),
                        (a, b) -> a
                ));

        totals = mentionSemestreEcueDetails.stream()
                .map(row -> {

                    String mentionSemestreEcueDetailId = row.getId();

                    CotationDetail annuel = annuelsMap.get(mentionSemestreEcueDetailId);
                    CotationDetail examen = examensMap.get(mentionSemestreEcueDetailId);

                    float noteAnnuel = annuel != null && annuel.getNote() != null
                            ? annuel.getNote() : 0F;

                    float noteExamen = examen != null && examen.getNote() != null
                            ? examen.getNote()  : 0F;

                    float noteTotal = noteAnnuel + noteExamen;

                    CotationDetail total;

                    if (examen != null) {
                        total = (CotationDetail) examen.clone();
                    } else if (annuel != null) {
                        total = (CotationDetail) annuel.clone();
                    } else {
                        total = new CotationDetail();
                        total.setMentionSemestreEcue(row);
                    }

                    Integer maxima = row.getMaxima();

                    float noteFinale = maxima != null && noteTotal > maxima ? noteTotal / 2F : noteTotal;

                    total.setNote(noteFinale);

                    return total;
                })
                .toList();

        float moyenne = (float) totals.stream()
                .map(CotationDetail::getNote)
                .filter(Objects::nonNull)
                .mapToDouble(Float::doubleValue)
                .average()
                .orElse(0.0);

        setMoyenne(BigDecimal.valueOf(moyenne).setScale(1, RoundingMode.HALF_UP).floatValue());

        deliberation.setMoyenne(moyenne);
        deliberation.setCredits(credits);
        deliberation.setValides(valides);
        decision = deliberation.getDecision().getCode();
    }

    /*private void refreshTotals() {

        if (mentionSemestreEcueDetails == null) {
            totals = List.of();
            setMoyenne(0F);
            return;
        }

        var annuelsSafe = annuels != null ? annuels : List.<CotationDetail>of();
        var examensSafe = examens != null ? examens : List.<CotationDetail>of();

        totals = IntStream.range(0, mentionSemestreEcueDetails.size())
                .mapToObj(i -> {
                    var row = mentionSemestreEcueDetails.get(i);

                    var annuel = annuelsSafe.stream()
                            .filter(a -> a.getMentionSemestreEcue() != null
                                    && row.getId() != null
                                    && a.getMentionSemestreEcue().getId().equals(row.getId()))
                            .findFirst()
                            .orElse(null);

                    var examen = examensSafe.stream()
                            .filter(e -> e.getMentionSemestreEcue() != null
                                    && row.getId() != null
                                    && e.getMentionSemestreEcue().getId().equals(row.getId()))
                            .findFirst()
                            .orElse(null);

                    float noteAnnuel = annuel != null && annuel.getNote() != null
                            ? annuel.getNote()
                            : 0F;

                    float noteExamen = examen != null && examen.getNote() != null
                            ? examen.getNote()
                            : 0F;

                    float noteTotal = noteAnnuel + noteExamen;

                    CotationDetail total;

                    if (examen != null) {
                        total = (CotationDetail) examen.clone();
                    } else if (annuel != null) {
                        total = (CotationDetail) annuel.clone();
                    } else {
                        total = new CotationDetail();
                        total.setMentionSemestreEcue(row);
                    }

                    Integer maxima = row.getMaxima();

                    total.setNote(
                            maxima != null && noteTotal > maxima
                                    ? noteTotal / 2f
                                    : noteTotal
                    );

                    return total;
                })
                .toList();

        float mean = (float) totals.stream()
                .map(CotationDetail::getNote)
                .filter(Objects::nonNull)
                .mapToDouble(Float::doubleValue)
                .average()
                .orElse(0.0f);

        setMoyenne(
                BigDecimal.valueOf(mean)
                        .setScale(1, RoundingMode.HALF_UP)
                        .floatValue()
        );
    }*/
}