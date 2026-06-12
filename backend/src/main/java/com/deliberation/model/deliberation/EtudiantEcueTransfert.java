package com.deliberation.model.deliberation;

import com.deliberation.dto.deliberation.EtudiantTransfertEcueDTO;
import com.deliberation.model.ModelBase;
import com.deliberation.model.cotation.CotationDetail;
import com.deliberation.model.cotation.Semestre;
import com.deliberation.model.inscription.AnneeAcademique;
import com.deliberation.model.inscription.Etudiant;
import jakarta.persistence.*;

@Entity
@Table(name = "etudiant_ecue_transfert")
public class EtudiantEcueTransfert extends ModelBase {
    @ManyToOne
    @JoinColumn(name = "cotation_id")
    private CotationDetail cotation;

    @ManyToOne
    @JoinColumn(name = "etudiant_id")
    private Etudiant etudiant;

    @ManyToOne
    @JoinColumn(name = "semestre_id")
    private Semestre semestre;

    @ManyToOne
    @JoinColumn(name = "annee_id")
    private AnneeAcademique annee;

    private Float credit;
    private Float note;

    public CotationDetail getCotation() {
        return cotation;
    }

    public void setCotation(CotationDetail cotation) {
        this.cotation = cotation;
    }

    public Etudiant getEtudiant() {
        return etudiant;
    }

    public void setEtudiant(Etudiant etudiant) {
        this.etudiant = etudiant;
    }

    public Semestre getSemestre() {
        return semestre;
    }

    public void setSemestre(Semestre semestre) {
        this.semestre = semestre;
    }

    public AnneeAcademique getAnnee() {
        return annee;
    }

    public void setAnnee(AnneeAcademique annee) {
        this.annee = annee;
    }

    public Float getCredit() {
        return credit;
    }

    public void setCredit(Float credit) {
        this.credit = credit;
    }

    public Float getNote() {
        return note;
    }

    public void setNote(Float note) {
        this.note = note;
    }

    /***
     *
     * @param dto
     * @param cotation
     * @param etudiant
     * @param semestre
     * @param annee
     */
    public void fromDTO(EtudiantTransfertEcueDTO dto, CotationDetail cotation, Etudiant etudiant, Semestre semestre, AnneeAcademique annee)
    {
        if (dto == null) return;

        setId(dto.id);
        setCredit(dto.credit);
        setNote(dto.note);

        if(cotation != null)
            setCotation(cotation);

        if(etudiant != null)
            setEtudiant(etudiant);

        if(semestre != null)
            setSemestre(semestre);

        if(annee != null)
            setAnnee(annee);
    }
}