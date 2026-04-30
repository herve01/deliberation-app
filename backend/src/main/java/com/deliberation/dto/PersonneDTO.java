package com.deliberation.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public abstract class PersonneDTO {
    public String id;
    public String matricule;
    public String nom;
    public String postnom;
    public String prenom;
    public String sexe;
    public Integer paysNaissanceId;
    public String lieuNaissance;
    public LocalDate dateNaissance;
    public String telephone;
}
