package com.deliberation.dto.setting;

import com.deliberation.model.enums.Role;

import java.time.LocalDateTime;

public class UserDTO {
    public String id;
    public String nom;
    public String prenom;
    public String username;
    public String email;
    public String passwd;
    public Role role;
    public Boolean etat;
    public Boolean estValide;
}
