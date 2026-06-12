package com.deliberation.model.cotation;

import com.deliberation.dto.cotation.UniteEnseignementDTO;
import com.deliberation.model.ModelBase;
import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(name = "unite_enseignement")
public class UniteEnseignement extends ModelBase {
    private String code;
    private String intitule;
    private Float credit;

    @Column(name = "nombre_heure_cmi")
    private Float nombreHeureCmi;

    @Column(name = "nombre_heure_tp")
    private Float nombreHeureTp;

    @Column(name = "nombre_heure_td")
    private Float nombreHeureTd;

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
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

    public void fromDTO(UniteEnseignementDTO dto)
    {
        if (dto == null) return;

        setId(dto.id);
        setCode(dto.code);
        setIntitule(dto.intitule);
        setCredit(dto.credit);
        setNombreHeureCmi(dto.nombreHeureCmi);
        setNombreHeureTd(dto.nombreHeureTd);
        setNombreHeureTp(dto.nombreHeureTp);
    }
}