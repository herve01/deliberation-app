package com.deliberation.model.cotation;

import com.deliberation.dto.cotation.SemestreDTO;
import com.deliberation.dto.cotation.SessionDTO;
import com.deliberation.model.ModelBase;
import com.deliberation.model.inscription.Mention;
import com.deliberation.model.inscription.Niveau;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;

import java.util.UUID;

@Entity
public class Session extends ModelBase {
    @ManyToOne
    @JoinColumn(name = "semestre_id")
    private Semestre semestre;

    private Integer numero;

    public Semestre getSemestre() {
        return semestre;
    }

    public void setSemestre(Semestre semestre) {
        this.semestre = semestre;
    }

    public Integer getNumero() {
        return numero;
    }

    public void setNumero(Integer numero) {
        this.numero = numero;
    }

    public void fromDTO(SessionDTO dto, Semestre semestre)
    {
        if (dto == null) return;

        setId(dto.id);
        setNumero(dto.numero);

        if(semestre != null)
            setSemestre(semestre);
    }

    @JsonProperty(value = "sessionName", access = JsonProperty.Access.READ_ONLY)
    public String getSessionName()
    {
        return numero < 0 ? "Annuel" :
                numero % 2 == 0 ? "Rattrapage" :
                String.format("Session %s", numero);
    }
}