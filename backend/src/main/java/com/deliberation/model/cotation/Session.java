package com.deliberation.model.cotation;

import com.deliberation.dto.cotation.SessionDTO;
import com.deliberation.model.ModelBase;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

@Entity
public class Session extends ModelBase {
    @ManyToOne
    @JoinColumn(name = "semestre_id")
    private Semestre semestre;

    private Integer numero;

    @Column(name = "est_annuel")
    private Boolean estAnnuel;

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

    public Boolean getEstAnnuel() {
        return estAnnuel;
    }

    public void setEstAnnuel(Boolean estAnnuel) {
        this.estAnnuel = estAnnuel;
    }

    public void fromDTO(SessionDTO dto, Semestre semestre)
    {
        if (dto == null) return;

        setId(dto.id);
        setNumero(dto.numero);
        setEstAnnuel(dto.estAnnuel);

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