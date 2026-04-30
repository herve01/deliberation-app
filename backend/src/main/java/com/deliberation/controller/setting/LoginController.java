package com.deliberation.controller.setting;

import com.deliberation.dto.setting.LoginDTO;
import com.deliberation.dto.setting.UserDTO;
import com.deliberation.model.setting.User;
import com.deliberation.service.setting.UserService;
import io.swagger.v3.oas.annotations.Operation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api")
public class LoginController {

    private final UserService service;
    private static final Logger logger = LoggerFactory.getLogger(LoginController.class);

    public LoginController(UserService service) {
        this.service = service;
    }

    @PostMapping("/login")
    @Operation(
            summary = "Connexion utilisateur",
            description = "Permet à un utilisateur de se connecter en fournissant son nom d'utilisateur et son mot de passe."
    )
    public ResponseEntity<?> login(@RequestBody LoginDTO dto) {

        if (dto == null || dto.username == null || dto.passwd == null) {
            logger.warn("[Auth] Requête invalide");
            return ResponseEntity.badRequest().body("Requête invalide");
        }

        String username = dto.username.trim();

        logger.info("[Auth] Tentative de connexion pour : {}", username);

        boolean isAuthenticated = service.authenticate(username, dto.passwd);

        if (!isAuthenticated) {
            logger.warn("[Auth] Échec de connexion pour : {}", username);
            return ResponseEntity.status(401).body("Identifiants invalides");
        }

        logger.info("[Auth] Connexion réussie pour : {}", username);

        return ResponseEntity.ok("Connexion réussie");
    }
}