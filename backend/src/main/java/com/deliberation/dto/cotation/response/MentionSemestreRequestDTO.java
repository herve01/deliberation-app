package com.deliberation.dto.cotation.response;

import com.deliberation.dto.cotation.MentionSemestreEcueDTO;
import com.deliberation.dto.cotation.MentionSemestreEcueDetailDTO;

import java.util.List;

public class MentionSemestreRequestDTO {
    public MentionSemestreEcueDTO mentionSemestre;
    public List<MentionSemestreEcueDetailDTO> details;
}