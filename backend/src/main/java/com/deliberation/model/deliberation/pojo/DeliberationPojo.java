package com.deliberation.model.deliberation.pojo;

import com.deliberation.model.inscription.Inscription;

public class DeliberationPojo {
    private Inscription inscription;

    private Float credits;

    private Float valides;

    private Float transferts;

    private Float moyenne;

    private String decision;

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
    }

    public Float getValides() {
        return valides;
    }

    public void setValides(Float valides) {
        this.valides = valides;
    }

    public Float getTransferts() {
        return transferts;
    }

    public void setTransferts(Float transferts) {
        this.transferts = transferts;
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
}
