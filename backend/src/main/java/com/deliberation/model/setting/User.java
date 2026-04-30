package com.deliberation.model.setting;

import com.deliberation.dto.deliberation.MentionJuryMembreDetailDTO;
import com.deliberation.dto.setting.UserDTO;
import com.deliberation.model.ModelBase;
import com.deliberation.model.deliberation.JuryMembre;
import com.deliberation.model.enums.Role;
import com.deliberation.model.inscription.AnneeAcademique;
import jakarta.persistence.*;

@Entity
@Table(name = "user", uniqueConstraints = @UniqueConstraint(columnNames = {"email", "username"}))
public class User extends ModelBase {
    private String nom;
    private String prenom;
    private String username;
    private String email;

    private String passwd;

    @Enumerated(EnumType.STRING)
    private Role role;

    private Boolean etat;

    @Column(name = "est_valide")
    private Boolean estValide;

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getPrenom() {
        return prenom;
    }

    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPasswd() {
        return passwd;
    }

    public void setPasswd(String passwd) {
        this.passwd = passwd;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public Boolean getEtat() {
        return etat;
    }

    public void setEtat(Boolean etat) {
        this.etat = etat;
    }

    public Boolean getEstValide() {
        return estValide;
    }

    public void setEstValide(Boolean estValide) {
        this.estValide = estValide;
    }

    public void fromDTO(UserDTO dto)
    {
        if (dto == null) return;

        setId(dto.id);
        setNom(dto.nom);
        setPrenom(dto.prenom);
        setUsername(dto.username);
        setPasswd(dto.passwd);
        setRole(dto.role);
        setEstValide(dto.estValide);
        setEtat(dto.etat);
    }
}