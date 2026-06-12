package com.deliberation.model.cotation;

import com.deliberation.dto.cotation.EcueDTO;
import com.deliberation.model.ModelBase;
import com.deliberation.model.inscription.Mention;
import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(name = "ecue")
public class Ecue extends ModelBase {
    @ManyToOne
    @JoinColumn(name = "ue_id", nullable = false)
    private UniteEnseignement ue;

    @Column(length = 100)
    private String intitule;

    private Float credit;

    @Column(name = "nombre_heure_cmi")
    private Float nombreHeureCmi;

    @Column(name = "nombre_heure_tp")
    private Float nombreHeureTp;

    @Column(name = "nombre_heure_td")
    private Float nombreHeureTd;

    public UniteEnseignement getUE() {
        return ue;
    }

    public void setUE(UniteEnseignement ue) {
        this.ue = ue;
    }

    public String getIntitule() {
        return intitule;
    }

    public void setIntitule(String intitule) {
        this.intitule = intitule;
    }

    public Float getCredit() {
        return credit;
    }

    public void setCredit(Float credit) {
        this.credit = credit;
    }

    public Float getNombreHeureCmi() {
        return nombreHeureCmi;
    }

    public void setNombreHeureCmi(Float nombreHeureCmi) {
        this.nombreHeureCmi = nombreHeureCmi;
    }

    public Float getNombreHeureTp() {
        return nombreHeureTp;
    }

    public void setNombreHeureTp(Float nombreHeureTp) {
        this.nombreHeureTp = nombreHeureTp;
    }

    public Float getNombreHeureTd() {
        return nombreHeureTd;
    }

    public void setNombreHeureTd(Float nombreHeureTd) {
        this.nombreHeureTd = nombreHeureTd;
    }

    //Mappage
    public void fromDTO(EcueDTO dto, UniteEnseignement ue)
    {
        if (dto == null) return;

        setId(dto.id);
        setIntitule(dto.intitule);
        setCredit(dto.credit);
        setNombreHeureCmi(dto.nombreHeureCmi);
        setNombreHeureTd(dto.nombreHeureTd);
        setNombreHeureTp(dto.nombreHeureTp);

        if(ue != null)
            setUE(ue);
    }
}