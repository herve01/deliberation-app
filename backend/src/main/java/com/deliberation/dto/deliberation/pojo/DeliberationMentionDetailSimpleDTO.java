package com.deliberation.dto.deliberation.pojo;

import com.deliberation.dto.inscription.InscriptionDTO;
import com.deliberation.model.enums.MentionType;

public class DeliberationMentionDetailSimpleDTO {
    public String id;
    private String inscriptionId;
    public Float pourcentage;
    public Float note;
    public Float total;
    public Boolean aEchoue;
    public MentionType mention;
}
