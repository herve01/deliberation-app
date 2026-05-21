package com.deliberation.dto.deliberation;

import com.deliberation.dto.cotation.SemestreDTO;
import com.deliberation.dto.cotation.SessionDTO;
import com.deliberation.dto.inscription.AnneeAcademiqueDTO;
import com.deliberation.dto.inscription.InscriptionDTO;
import com.deliberation.dto.inscription.MentionDTO;
import com.deliberation.model.enums.MentionType;

public class DeliberationMentionDetailDTO {
    public String id;
    public String inscriptionId;
    public String deliberationId;
    public Float pourcentage;
    public Float note;
    public Float total;
    public Boolean aEchoue;

    public MentionType mention;
}
