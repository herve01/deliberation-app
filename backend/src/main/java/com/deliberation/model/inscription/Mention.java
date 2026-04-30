package com.deliberation.model.inscription;

import com.deliberation.dto.inscription.FiliereDTO;
import com.deliberation.dto.inscription.MentionDTO;
import com.deliberation.model.ModelBase;
import jakarta.persistence.*;

import java.util.UUID;

@Entity
//@Table(name = "mention")
public class Mention extends ModelBase {
    private String intitule;

    @Column(name = "numero_semestre")
    private Integer numeroSemestre;

    @ManyToOne
    @JoinColumn(name = "niveau_id")
    private Niveau niveau;

    @ManyToOne
    @JoinColumn(name = "filiere_id")
    private Filiere filiere;

    public String getIntitule() {
        return intitule;
    }

    public void setIntitule(String intitule) {
        this.intitule = intitule;
    }

    public Integer getNumeroSemestre() {
        return numeroSemestre;
    }

    public void setNumeroSemestre(Integer numeroSemestre) {
        this.numeroSemestre = numeroSemestre;
    }

    public Niveau getNiveau() {
        return niveau;
    }

    public void setNiveau(Niveau niveau) {
        this.niveau = niveau;
    }

    public Filiere getFiliere() {
        return filiere;
    }

    public void setFiliere(Filiere filiere) {
        this.filiere = filiere;
    }

    /***
     *
     * @param dto
     * @param niveau
     * @param filiere
     */
    public void fromDTO(MentionDTO dto, Niveau niveau, Filiere filiere)
    {
        if (dto == null) return;

        setId(dto.id);
        setIntitule(dto.intitule);
        setNumeroSemestre(dto.numeroSemestre);

        if(niveau != null)
            setNiveau(niveau);

        if(filiere != null)
            setFiliere(filiere);
    }
}