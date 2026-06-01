package com.deliberation.dto;

public class DashboardCardDTO {
    //public String titre;
    public Long count;
    public Long objectif;
    public Double progression;
    //public String couleur;

    public DashboardCardDTO(Long count, Long objectif)
    {
        this.count = count;
        this.objectif = objectif;

        progression = this.objectif == 0 ? 0 :
                (double)this.count/ this.objectif  * 100;
    }
}
