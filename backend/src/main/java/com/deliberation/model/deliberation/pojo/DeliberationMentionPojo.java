package com.deliberation.model.deliberation.pojo;

import com.deliberation.model.cotation.Categorie;
import com.deliberation.model.cotation.CotationDetail;
import com.deliberation.model.cotation.MentionSemestreEcueDetail;
import com.deliberation.model.deliberation.DeliberationDetail;
import com.deliberation.model.inscription.Inscription;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

import java.util.Map;
import java.util.concurrent.atomic.AtomicReference;
import java.util.function.Function;
import java.util.stream.Collectors;

public class DeliberationMentionPojo {

    private Inscription inscription;

    private List<MentionSemestreEcueDetail> mentionSemestreEcueDetails;
    private List<CotationDetail> annuels;
    private List<CotationDetail> examens;
    private List<CotationDetail> totals;

    private List<CotationDetail> rattrapages;
    private List<CotationDetail> rattrapageTotals;

    private DeliberationDetail deliberation;
    private List<DictCategorie> means;
    private List<Categorie> categories;

    private List<TransfertSourceDestination> transferts;

    public DeliberationMentionPojo() {
        this.means = new ArrayList<>();
        deliberation = new DeliberationDetail(){
            @Override
            public void setInscription(Inscription inscription) {
                super.setInscription(inscription);
            }
        };
    }

    public DeliberationMentionPojo(List<Categorie> categories)  {

        this();

        this.categories = categories;
        categories.forEach(c-> {
            var dict = new DictCategorie();
            dict.key = c.getId();
            dict.value = 0F;
            dict.count = 0L;
            means.add(dict);
        });
    }

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

        refreshTotals();
    }

    public List<CotationDetail> getAnnuels() {
        return annuels;
    }

    public void setAnnuels(List<CotationDetail> annuels) {
        this.annuels = annuels;
    }

    public List<CotationDetail> getExamens() {
        return examens;
    }

    public void setExamens(List<CotationDetail> examens) {
        this.examens = examens;
    }

    public List<CotationDetail> getTotals() {
        return totals;
    }

    public List<CotationDetail> getRattrapages() {
        return rattrapages;
    }

    public void setRattrapages(List<CotationDetail> rattrapages) {
        this.rattrapages = rattrapages;
    }

    public List<CotationDetail> getRattrapageTotals() {
        return rattrapageTotals;
    }

    public void setRattrapageTotals(List<CotationDetail> rattrapageTotals) {
        this.rattrapageTotals = rattrapageTotals;
    }

    public List<DictCategorie> getMeans() {
        return means;
    }

    public void setMeans(List<DictCategorie> mean) {
        this.means = mean;
    }

    public DeliberationDetail getDeliberation() {
        return deliberation;
    }

    public void setDeliberation(DeliberationDetail deliberation) {
        this.deliberation = deliberation;
    }

    public List<TransfertSourceDestination> getTransferts() {
        return transferts;
    }

    public void setTransferts(List<TransfertSourceDestination> transferts) {
        this.transferts = transferts;
    }

    private void refreshTotals() {

        means.forEach(m -> {
            m.value = 0F;
            m.count = mentionSemestreEcueDetails.stream()
                    .filter(e -> e.getCategorie() != null
                            && m.key.equals(e.getCategorie().getId()))
                    .count();
        });
        if (mentionSemestreEcueDetails == null || mentionSemestreEcueDetails.isEmpty()) {
            totals = List.of();
            return;
        }

        var annuelsSafe = annuels != null ? annuels : List.<CotationDetail>of();
        var examensSafe = examens != null ? examens : List.<CotationDetail>of();
        var rattrapagesSafe = rattrapages != null ? rattrapages : List.<CotationDetail>of();

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

        Map<String, CotationDetail> rattrapagesMap = rattrapagesSafe.stream()
                .filter(e -> e.getMentionSemestreEcue() != null
                        && e.getMentionSemestreEcue().getId() != null)
                .collect(Collectors.toMap(
                        e -> e.getMentionSemestreEcue().getId(),
                        Function.identity(),
                        (a, b) -> a
                ));

        AtomicReference<Float> newValides = new AtomicReference<>(0F);
        AtomicReference<Float> newTotal = new AtomicReference<>(0F);

        totals = mentionSemestreEcueDetails.stream()
            .map(row -> {

                String mentionSemestreEcueDetailId = row.getId();

                CotationDetail annuel = annuelsMap.get(mentionSemestreEcueDetailId);
                CotationDetail examen = examensMap.get(mentionSemestreEcueDetailId);
                CotationDetail rattrapage = rattrapagesMap.get(mentionSemestreEcueDetailId);

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

                total.setNote(noteTotal);

                means.stream()
                    .filter(dict -> row.getCategorie() != null
                            && row.getCategorie().getId() != null
                            && row.getCategorie().getId().equals(dict.key))
                    .findFirst()
                    .ifPresent(dict -> {
                        dict.value += noteTotal / dict.count.floatValue();
                    });

                newTotal.updateAndGet(v -> v + (noteTotal * row.getCredit()));
                boolean valide = maxima != null && noteTotal >= maxima / 2F;
                total.setEstValide(valide);

                if (valide) { // adapter selon votre règle métier
                    newValides.updateAndGet(v -> v + row.getCredit());
                }
                return total;
            })
            .toList();

        means.forEach(m -> {
            m.value = BigDecimal.valueOf(m.value).setScale(1, RoundingMode.HALF_UP).floatValue();
        });

        float mean = (float) means.stream()
                .filter(m -> m.value != null)
                .mapToDouble(m -> m.value)
                .sum() / means.stream().count();

        if(deliberation.getId() == null || deliberation.getId().isBlank()) {
            var _mean = BigDecimal.valueOf(mean).setScale(1, RoundingMode.HALF_UP).floatValue();
            deliberation.setMoyenne(_mean);
            deliberation.setValides(newValides.get());
            deliberation.setTotal(newTotal.get());
        }
    }
}