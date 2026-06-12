package com.deliberation.model.deliberation.pojo;

import com.deliberation.model.cotation.CotationDetail;

public class TransfertSourceDestination {

    private String sourceId;
    private String destinationId;
    private Float note;

    public String getSourceId() {
        return sourceId;
    }

    public void setSourceId(String sourceId) {
        this.sourceId = sourceId;
    }

    public String getDestinationId() {
        return destinationId;
    }

    public void setDestinationId(String destinationId) {
        this.destinationId = destinationId;
    }

    public Float getNote() {
        return note;
    }

    public void setNote(Float note) {
        this.note = note;
    }
}