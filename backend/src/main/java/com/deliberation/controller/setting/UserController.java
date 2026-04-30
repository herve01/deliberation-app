package com.deliberation.controller.setting;

import com.deliberation.dto.setting.UserDTO;
import com.deliberation.model.setting.User;
import com.deliberation.service.setting.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService service;
    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    public UserController(UserService service) {
        this.service = service;
    }

    @GetMapping
    @Operation(
            summary = "Lister les utilisateurs",
            description = "Retourne la liste complète des utilisateurs"
    )
    @ApiResponse(responseCode = "200", description = "Liste récupérée avec succès")
    public List<User> all() {
        logger.info("[UserController] GET /api/users - Récupération de tous les utilisateurs");
        return service.getAll();
    }

    @GetMapping("/{id}")
    @Operation(
            summary = "Obtenir un utilisateur par ID",
            description = "Retourne un utilisateur à partir de son identifiant"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Utilisateur trouvé"),
            @ApiResponse(responseCode = "404", description = "Utilisateur introuvable")
    })
    public ResponseEntity<User> get(@PathVariable String id) {

        logger.info("[UserController] GET /api/users/{} - Récupération", id);

        return service.get(id)
                .map(user -> {
                    logger.info("[UserController] Utilisateur {} trouvé", id);
                    return ResponseEntity.ok(user);
                })
                .orElseGet(() -> {
                    logger.warn("[UserController] Utilisateur {} introuvable", id);
                    return ResponseEntity.notFound().build();
                });
    }

    @PostMapping
    @Operation(
            summary = "Créer un utilisateur",
            description = "Crée un nouvel utilisateur à partir des données fournies"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Utilisateur créé"),
            @ApiResponse(responseCode = "400", description = "Requête invalide")
    })
    public ResponseEntity<User> create(@RequestBody UserDTO dto) {

        logger.info("[UserController] POST /api/users - Création utilisateur");

        User u = new User();
        u.fromDTO(dto);

        User created = service.create(u);

        logger.info("[UserController] Utilisateur créé avec succès - ID: {}", created.getId());

        return ResponseEntity
                .created(URI.create("/api/users/" + created.getId()))
                .body(created);
    }

    @PutMapping("/{id}")
    @Operation(
            summary = "Mettre à jour un utilisateur",
            description = "Met à jour les informations d'un utilisateur existant"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Utilisateur mis à jour"),
            @ApiResponse(responseCode = "404", description = "Utilisateur introuvable")
    })
    public ResponseEntity<User> update(@PathVariable String id,
                                       @RequestBody UserDTO dto) {

        logger.info("[UserController] PUT /api/users/{} - Mise à jour", id);

        return service.get(id)
                .map(existing -> {

                    existing.fromDTO(dto);

                    User updated = service.update(id, existing);

                    logger.info("[UserController] Utilisateur {} mis à jour", id);

                    return ResponseEntity.ok(updated);
                })
                .orElseGet(() -> {
                    logger.warn("[UserController] Utilisateur {} introuvable pour mise à jour", id);
                    return ResponseEntity.notFound().build();
                });
    }

    @DeleteMapping("/{id}")
    @Operation(
            summary = "Supprimer un utilisateur",
            description = "Supprime un utilisateur à partir de son identifiant"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Utilisateur supprimé"),
            @ApiResponse(responseCode = "404", description = "Utilisateur introuvable")
    })
    public ResponseEntity<Void> delete(@PathVariable String id) {

        logger.info("[UserController] DELETE /api/users/{} - Suppression", id);

        if (service.get(id).isEmpty()) {
            logger.warn("[UserController] Utilisateur {} introuvable", id);
            return ResponseEntity.notFound().build();
        }

        service.delete(id);

        logger.info("[UserController] Utilisateur {} supprimé", id);

        return ResponseEntity.noContent().build();
    }
}