package com.deliberation.model.cotation.pojo;

import com.deliberation.model.cotation.MentionSemestreEcueDetail;
import com.deliberation.model.inscription.Mention;

public class MentionPojo {

    private Mention mention;

    private long countSemestre1;

    private long countSemestre2;

    public Mention getMention() {
        return mention;
    }

    public void setMention(Mention mention) {
        this.mention = mention;
    }

    public long getCountSemestre1() {
        return countSemestre1;
    }

    public void setCountSemestre1(long countSemestre1) {
        this.countSemestre1 = countSemestre1;
    }

    public long getCountSemestre2() {
        return countSemestre2;
    }

    public void setCountSemestre2(long countSemestre2) {
        this.countSemestre2 = countSemestre2;
    }
}
