package com.deliberation.model.inscription;

import com.deliberation.dto.inscription.FiliereDTO;
import com.deliberation.dto.inscription.MentionDTO;
import com.deliberation.model.ModelBase;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(name = "mention")
public class Mention extends ModelBase {
    private String intitule;

    @Column(name = "numero_semestre_incrementor")
    private Integer numeroSemestreIncrementor;

    @Column(name = "max_jury_membre")
    private Integer maxJuryMembre;

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

    public Integer getNumeroSemestreIncementor() {
        return numeroSemestreIncrementor;
    }

    public void setNumeroSemestreIncementor(Integer numeroSemestreIncrementor) {
        this.numeroSemestreIncrementor = numeroSemestreIncrementor;
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

    public Integer getNumeroSemestreIncrementor() {
        return numeroSemestreIncrementor;
    }

    public void setNumeroSemestreIncrementor(Integer numeroSemestreIncrementor) {
        this.numeroSemestreIncrementor = numeroSemestreIncrementor;
    }

    public Integer getMaxJuryMembre() {
        return maxJuryMembre;
    }

    public void setMaxJuryMembre(Integer maxJuryMembre) {
        this.maxJuryMembre = maxJuryMembre;
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
        setNumeroSemestreIncementor(dto.numeroSemestreIncrementor);
        setMaxJuryMembre(dto.maxJuryMembre);

        if(niveau != null)
        {
            setNiveau(niveau);

            Integer semestre = niveau.getCycle().getOrdre() == 1 ? 0 :
                                (niveau.getCycle().getOrdre() == 2 ? 1 : 2);

            setNumeroSemestreIncementor(semestre);
        }

        if(filiere != null)
            setFiliere(filiere);
    }

    @JsonProperty(value = "mentionName", access = JsonProperty.Access.READ_ONLY)
    public String getMentionName()
    {
        return String.format("%s %s", getNiveau().getIntitule(), intitule);
    }
}