package com.deliberation.controller.cotation;

import com.deliberation.dto.cotation.EcueDTO;
import com.deliberation.model.cotation.Ecue;
import com.deliberation.model.cotation.UniteEnseignement;
import com.deliberation.service.cotation.EcueService;
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
@RequestMapping("/api/ecues")
public class EcueController {

    private final EcueService service;
    private final UniteEnseignementService uniteService;

    private static final Logger logger = LoggerFactory.getLogger(EcueController.class);

    public EcueController(EcueService service, UniteEnseignementService uniteService) {
        this.service = service;
        this.uniteService = uniteService;
    }

    @GetMapping
    @Operation(
            summary = "Lister les ECUEs",
            description = "Retourne la liste complète des ECUEs"
    )
    @ApiResponse(responseCode = "200", description = "Liste récupérée avec succès")
    public List<Ecue> all() {
        logger.info("[EcueController] GET /api/ecues - Récupération de tous les ECUEs");
        return service.getAll();
    }

    @GetMapping("/{id}")
    @Operation(
            summary = "Obtenir un ECUE par ID",
            description = "Retourne un ECUE à partir de son identifiant"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "ECUE trouvé"),
            @ApiResponse(responseCode = "404", description = "ECUE introuvable")
    })
    public ResponseEntity<Ecue> get(@PathVariable String id) {

        logger.info("[EcueController] GET /api/ecues/{} - Récupération", id);

        return service.get(id)
                .map(ecue -> {
                    logger.info("[EcueController] ECUE {} trouvé", id);
                    return ResponseEntity.ok(ecue);
                })
                .orElseGet(() -> {
                    logger.warn("[EcueController] ECUE {} introuvable", id);
                    return ResponseEntity.notFound().build();
                });
    }

    @PostMapping
    @Operation(
            summary = "Créer un ECUE",
            description = "Crée un nouveau ECUE lié à une unité d'enseignement"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "ECUE créé"),
            @ApiResponse(responseCode = "400", description = "Requête invalide")
    })
    public ResponseEntity<Ecue> create(@RequestBody EcueDTO dto) {

        logger.info("[EcueController] POST /api/ecues - Création d'un ECUE");

        UniteEnseignement ue = uniteService.get(dto.ueId)
                .orElseThrow(() -> new IllegalArgumentException("Unité d'enseignement introuvable"));

        Ecue instance = new Ecue();
        instance.fromDTO(dto, ue);

        Ecue created = service.create(instance);

        logger.info("[EcueController] ECUE créé avec succès - ID: {}", created.getId());

        return ResponseEntity
                .created(URI.create("/api/ecues/" + created.getId()))
                .body(created);
    }

    @PutMapping("/{id}")
    @Operation(
            summary = "Mettre à jour un ECUE",
            description = "Met à jour un ECUE existant"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "ECUE mis à jour"),
            @ApiResponse(responseCode = "404", description = "ECUE introuvable")
    })
    public ResponseEntity<Ecue> update(@PathVariable String id,
                                       @RequestBody EcueDTO dto) {

        logger.info("[EcueController] PUT /api/ecues/{} - Mise à jour", id);

        return service.get(id)
                .map(existing -> {

                    UniteEnseignement ue = null;
                    if (dto.ueId != null) {
                        ue = uniteService.get(dto.ueId)
                                .orElseThrow(() -> new IllegalArgumentException("Unité d'enseignement introuvable"));
                    }

                    existing.fromDTO(dto, ue);

                    Ecue updated = service.update(id, existing);

                    logger.info("[EcueController] ECUE {} mis à jour avec succès", id);

                    return ResponseEntity.ok(updated);
                })
                .orElseGet(() -> {
                    logger.warn("[EcueController] ECUE {} introuvable", id);
                    return ResponseEntity.notFound().build();
                });
    }

    @DeleteMapping("/{id}")
    @Operation(
            summary = "Supprimer un ECUE",
            description = "Supprime un ECUE"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "ECUE supprimé"),
            @ApiResponse(responseCode = "404", description = "ECUE introuvable")
    })
    public ResponseEntity<Void> delete(@PathVariable String id) {

        logger.info("[EcueController] DELETE /api/ecues/{} - Suppression", id);

        if (service.get(id).isEmpty()) {
            logger.warn("[EcueController] ECUE {} introuvable", id);
            return ResponseEntity.notFound().build();
        }

        service.delete(id);

        logger.info("[EcueController] ECUE {} supprimé avec succès", id);

        return ResponseEntity.noContent().build();
    }
}