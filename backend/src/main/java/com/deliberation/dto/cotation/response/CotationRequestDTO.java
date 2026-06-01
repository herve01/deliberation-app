package com.deliberation.dto.cotation.response;

import com.deliberation.dto.cotation.CotationDTO;
import com.deliberation.dto.cotation.CotationDetailDTO;

import java.util.List;

public class CotationRequestDTO {
    public CotationDTO cotation;
    public List<CotationDetailDTO> details;
}