package com.deliberation.model.deliberation.pojo;

import com.deliberation.model.deliberation.DeliberationDetail;
import com.deliberation.model.inscription.Inscription;

import java.util.ArrayList;

public class DeliberationPojo {
    private Inscription inscription;

    private DeliberationDetail deliberation;

    public Inscription getInscription() {
        return inscription;
    }

    public void setInscription(Inscription inscription) {
        this.inscription = inscription;
    }

    public DeliberationDetail getDeliberation() {
        return deliberation;
    }

    public void setDeliberation(DeliberationDetail deliberation) {
        this.deliberation = deliberation;
    }
}
