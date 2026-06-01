package com.deliberation.dto.deliberation;

import com.deliberation.model.enums.MentionType;

public class DeliberationDetailDTO {
    public String id;
    public String inscriptionId;
    public String deliberationId;
    public Float credits;
    public Float valides;
    public Float transferes;
    public Float moyenne;
    public Float total;
    public Boolean aEchoue;
    public MentionType decision;
}
