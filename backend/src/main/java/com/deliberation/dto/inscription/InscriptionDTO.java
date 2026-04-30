package com.deliberation.dto.inscription;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class InscriptionDTO {
    public String id;
    public String etudiantId;
    public String anneeId;
    public String mentionId;
    public Boolean estNouvelle;
    public LocalDateTime date;
    public LocalDateTime dateArret;

    // facultatif comme tu l'as demandé
    public String photo;
}
