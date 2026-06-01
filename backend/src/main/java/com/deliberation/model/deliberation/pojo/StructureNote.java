package com.deliberation.model.deliberation.pojo;

import com.deliberation.model.cotation.CotationDetail;
import com.deliberation.model.cotation.MentionSemestreEcue;

public class StructureNote {
    private MentionSemestreEcue mentionSemestreEcue;
    private CotationDetail annuel;
    private CotationDetail examen;
    private Integer maxima;

    public StructureNote(Integer maxima) {
        this.maxima = maxima;
    }

    public MentionSemestreEcue getMentionSemestreEcue() {
        return mentionSemestreEcue;
    }

    public void setMentionSemestreEcue(MentionSemestreEcue mentionSemestreEcue) {
        this.mentionSemestreEcue = mentionSemestreEcue;
    }

    public CotationDetail getAnnuel() {
        return annuel;
    }

    public void setAnnuel(CotationDetail annuel) {
        this.annuel = annuel;
    }

    public CotationDetail getExamen() {
        return examen;
    }

    public void setExamen(CotationDetail examen) {
        this.examen = examen;
    }

    public Float getTotal() {
        var noteTotal = this.annuel.getNote() + this.examen.getNote();
        return noteTotal > maxima ? (Float) noteTotal / 2 : noteTotal;
    }
}
