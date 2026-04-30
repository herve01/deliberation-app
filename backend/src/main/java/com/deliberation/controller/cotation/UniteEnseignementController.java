package com.deliberation.controller.cotation;

import com.deliberation.dto.cotation.UniteEnseignementDTO;
import com.deliberation.model.cotation.UniteEnseignement;
import com.deliberation.service.cotation.UniteEnseignementService;
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
@RequestMapping("/api/unite_enseignements")
public class UniteEnseignementController {

    private final UniteEnseignementService service;

    private static final Logger logger = LoggerFactory.getLogger(UniteEnseignementController.class);

    public UniteEnseignementController(UniteEnseignementService service) {
        this.service = service;
    }

    @GetMapping
    @Operation(
            summary = "Lister les unités d'enseignement",
            description = "Retourne la liste complète des unités d'enseignement"
    )
    @ApiResponse(responseCode = "200", description = "Liste récupérée avec succès")
    public List<UniteEnseignement> all() {
        logger.info("[UniteEnseignementController] GET /api/unite_enseignements - Récupération de toutes les unités d'enseignement");
        return service.getAll();
    }

    @GetMapping("/{id}")
    @Operation(
            summary = "Obtenir une unité d'enseignement par ID",
            description = "Retourne une unité d'enseignement à partir de son identifiant"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Unité d'enseignement trouvée"),
            @ApiResponse(responseCode = "404", description = "Unité d'enseignement introuvable")
    })
    public ResponseEntity<UniteEnseignement> get(@PathVariable String id) {

        logger.info("[UniteEnseignementController] GET /api/unite_enseignements/{} - Récupération", id);

        return service.get(id)
                .map(ue -> {
                    logger.info("[UniteEnseignementController] UE {} trouvée", id);
                    return ResponseEntity.ok(ue);
                })
                .orElseGet(() -> {
                    logger.warn("[UniteEnseignementController] UE {} introuvable", id);
                    return ResponseEntity.notFound().build();
                });
    }

    @PostMapping
    @Operation(
            summary = "Créer une unité d'enseignement",
            description = "Crée une nouvelle unité d'enseignement"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Unité d'enseignement créée"),
            @ApiResponse(responseCode = "400", description = "Requête invalide")
    })
    public ResponseEntity<UniteEnseignement> create(@RequestBody UniteEnseignementDTO dto) {

        logger.info("[UniteEnseignementController] POST /api/unite_enseignements - Création d'une UE");

        UniteEnseignement instance = new UniteEnseignement();
        instance.fromDTO(dto);

        UniteEnseignement created = service.create(instance);

        logger.info("[UniteEnseignementController] UE créée avec succès - ID: {}", created.getId());

        return ResponseEntity
                .created(URI.create("/api/unite_enseignements/" + created.getId()))
                .body(created);
    }

    @PutMapping("/{id}")
    @Operation(
            summary = "Mettre à jour une unité d'enseignement",
            description = "Met à jour une unité d'enseignement existante"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Unité d'enseignement mise à jour"),
            @ApiResponse(responseCode = "404", description = "Unité d'enseignement introuvable")
    })
    public ResponseEntity<UniteEnseignement> update(@PathVariable String id,
                                                    @RequestBody UniteEnseignementDTO dto) {

        logger.info("[UniteEnseignementController] PUT /api/unite_enseignements/{} - Mise à jour", id);

        return service.get(id)
                .map(existing -> {

                    existing.fromDTO(dto);

                    UniteEnseignement updated = service.update(id, existing);

                    logger.info("[UniteEnseignementController] UE {} mise à jour avec succès", id);

                    return ResponseEntity.ok(updated);
                })
                .orElseGet(() -> {
                    logger.warn("[UniteEnseignementController] UE {} introuvable", id);
                    return ResponseEntity.notFound().build();
                });
    }

    @DeleteMapping("/{id}")
    @Operation(
            summary = "Supprimer une unité d'enseignement",
            description = "Supprime une unité d'enseignement"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Unité d'enseignement supprimée"),
            @ApiResponse(responseCode = "404", description = "Unité d'enseignement introuvable")
    })
    public ResponseEntity<Void> delete(@PathVariable String id) {

        logger.info("[UniteEnseignementController] DELETE /api/unite_enseignements/{} - Suppression", id);

        if (service.get(id).isEmpty()) {
            logger.warn("[UniteEnseignementController] UE {} introuvable", id);
            return ResponseEntity.notFound().build();
        }

        service.delete(id);

        logger.info("[UniteEnseignementController] UE {} supprimée avec succès", id);

        return ResponseEntity.noContent().build();
    }
}