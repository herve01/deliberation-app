package com.deliberation.dto.deliberation.pojo;

import com.deliberation.dto.deliberation.DeliberationMentionDTO;
import com.deliberation.dto.deliberation.PersonnelDTO;

import java.util.List;

public class PvDeliberationDTO {
    private DeliberationMentionDTO deliberation;
    private List<PersonnelDTO> jury;
    private List<ResultatDeliberationDTO> resultats;
}