package com.deliberation.model.cotation;

import com.deliberation.dto.cotation.SemestreDTO;
import com.deliberation.model.ModelBase;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

@Entity
@Table(name = "semestre")
public class Semestre extends ModelBase {

    private Integer numero;

    public Integer getNumero() {
        return numero;
    }

    public void setNumero(Integer numero) {
        this.numero = numero;
    }

    public void fromDTO(SemestreDTO dto)
    {
        if (dto == null) return;

        setId(dto.id);
        setNumero(dto.numero);

    }
    @JsonProperty(value = "semestreName", access = JsonProperty.Access.READ_ONLY)
    public String getSemestreName()
    {
        return String.format("Semestre %s", numero);
    }

    @JsonProperty(value = "shortName", access = JsonProperty.Access.READ_ONLY)
    public String getShortName()
    {
        return String.format("S%s", numero);
    }
}