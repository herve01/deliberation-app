package com.deliberation.model.setting;

import com.deliberation.dto.setting.PaysDTO;
import com.deliberation.dto.setting.UserDTO;
import com.deliberation.model.ModelBase;
import jakarta.persistence.*;

import java.util.List;

@Entity
public class Pays {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;

    private String indic;

    private Integer actif;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getIndic() {
        return indic;
    }

    public void setIndic(String indic) {
        this.indic = indic;
    }

    public Integer getActif() {
        return actif;
    }

    public void setActif(Integer actif) {
        this.actif = actif;
    }

    public void fromDTO(PaysDTO dto)
    {
        if (dto == null) return;

        setId(dto.id);
        setNom(dto.nom);
        setIndic(dto.indic);
        setActif(dto.actif);
    }
}