package com.deliberation.dto.deliberation.response;

import com.deliberation.dto.deliberation.DeliberationDTO;
import com.deliberation.dto.deliberation.DeliberationDetailDTO;

import java.util.List;

public class DeliberationRequestDTO {
    public DeliberationDTO deliberation;
    public List<DeliberationDetailDTO> details;
}