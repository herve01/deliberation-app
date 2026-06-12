package com.deliberation.model.cotation;

import com.deliberation.dto.cotation.CategorieDTO;
import com.deliberation.model.ModelBase;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "categorie")
public class Categorie extends ModelBase {

    private String intitule;


    public String getIntitule() {
        return intitule;
    }

    public void setIntitule(String intitule) {
        this.intitule = intitule;
    }

    public void fromDTO(CategorieDTO dto)
    {
        if (dto == null) return;

        setId(dto.id);
        setIntitule(dto.intitule);
    }

}