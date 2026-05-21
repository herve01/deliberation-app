package com.deliberation.controller.cotation;

import com.deliberation.dto.cotation.SessionDTO;
import com.deliberation.model.cotation.Semestre;
import com.deliberation.model.cotation.Session;
import com.deliberation.service.cotation.SemestreService;
import com.deliberation.service.cotation.SessionService;
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
@RequestMapping("/api/sessions")
public class SessionController {

    private final SessionService service;
    private final SemestreService semestreService;

    private static final Logger logger = LoggerFactory.getLogger(SessionController.class);

    public SessionController(SessionService service, SemestreService semestreService) {
        this.service = service;
        this.semestreService = semestreService;
    }

    @GetMapping
    @Operation(
            summary = "Lister les sessions",
            description = "Retourne la liste complète des sessions"
    )
    @ApiResponse(responseCode = "200", description = "Liste récupérée avec succès")
    public List<Session> all() {
        logger.info("[SessionController] GET /api/sessions - Récupération de toutes les sessions");
        return service.getAll();
    }

    @GetMapping("/semestre-numero-incrementor/{incrementor}")
    @Operation(
            summary = "Lister les sessions",
            description = "Retourne la liste complète des sessions"
    )
    @ApiResponse(responseCode = "200", description = "Liste récupérée avec succès")
    public List<Session> all(@PathVariable Integer incrementor) {
        logger.info("[SessionController] GET /api/sessions - Récupération de toutes les sessions");
        return service.getAll(incrementor);
    }

    @GetMapping("/{id}")
    @Operation(
            summary = "Obtenir une session par ID",
            description = "Retourne une session à partir de son identifiant"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Session trouvée"),
            @ApiResponse(responseCode = "404", description = "Session introuvable")
    })
    public ResponseEntity<Session> get(@PathVariable String id) {

        logger.info("[SessionController] GET /api/sessions/{} - Récupération", id);

        return service.get(id)
                .map(session -> {
                    logger.info("[SessionController] Session {} trouvée", id);
                    return ResponseEntity.ok(session);
                })
                .orElseGet(() -> {
                    logger.warn("[SessionController] Session {} introuvable", id);
                    return ResponseEntity.notFound().build();
                });
    }

    @PostMapping
    @Operation(
            summary = "Créer une session",
            description = "Crée une nouvelle session liée à un semestre"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Session créée"),
            @ApiResponse(responseCode = "400", description = "Requête invalide")
    })
    public ResponseEntity<Session> create(@RequestBody SessionDTO dto) {

        logger.info("[SessionController] POST /api/sessions - Création d'une session");

        Semestre semestre = semestreService.get(dto.semestreId)
                .orElseThrow(() -> new IllegalArgumentException("Semestre introuvable"));

        Session instance = new Session();
        instance.fromDTO(dto, semestre);

        Session created = service.create(instance);

        logger.info("[SessionController] Session créée avec succès - ID: {}", created.getId());

        return ResponseEntity
                .created(URI.create("/api/sessions/" + created.getId()))
                .body(created);
    }

    @PutMapping("/{id}")
    @Operation(
            summary = "Mettre à jour une session",
            description = "Met à jour une session existante"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Session mise à jour"),
            @ApiResponse(responseCode = "404", description = "Session introuvable")
    })
    public ResponseEntity<Session> update(@PathVariable String id,
                                          @RequestBody SessionDTO dto) {

        logger.info("[SessionController] PUT /api/sessions/{} - Mise à jour", id);

        return service.get(id)
                .map(existing -> {

                    Semestre semestre = null;
                    if (dto.semestreId != null) {
                        semestre = semestreService.get(dto.semestreId)
                                .orElseThrow(() -> new IllegalArgumentException("Semestre introuvable"));
                    }

                    existing.fromDTO(dto, semestre);

                    Session updated = service.update(id, existing);

                    logger.info("[SessionController] Session {} mise à jour avec succès", id);

                    return ResponseEntity.ok(updated);
                })
                .orElseGet(() -> {
                    logger.warn("[SessionController] Session {} introuvable", id);
                    return ResponseEntity.notFound().build();
                });
    }

    @DeleteMapping("/{id}")
    @Operation(
            summary = "Supprimer une session",
            description = "Supprime une session"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Session supprimée"),
            @ApiResponse(responseCode = "404", description = "Session introuvable")
    })
    public ResponseEntity<Void> delete(@PathVariable String id) {

        logger.info("[SessionController] DELETE /api/sessions/{} - Suppression", id);

        if (service.get(id).isEmpty()) {
            logger.warn("[SessionController] Session {} introuvable", id);
            return ResponseEntity.notFound().build();
        }

        service.delete(id);

        logger.info("[SessionController] Session {} supprimée avec succès", id);

        return ResponseEntity.noContent().build();
    }
}