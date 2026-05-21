package com.deliberation.controller.inscription;

import com.deliberation.dto.inscription.CycleDTO;
import com.deliberation.model.inscription.Cycle;
import com.deliberation.service.inscription.CycleService;
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
@RequestMapping("/api/cycles")
public class CycleController {

    private final CycleService service;

    private static final Logger logger = LoggerFactory.getLogger(CycleController.class);

    public CycleController(CycleService service) {
        this.service = service;
    }

    @GetMapping
    @Operation(
            summary = "Lister les cycles",
            description = "Retourne la liste complète des cycles"
    )
    @ApiResponse(responseCode = "200", description = "Liste récupérée avec succès")
    public List<Cycle> all() {
        logger.info("[CycleController] GET /api/cycles - Récupération de tous les cycles");
        return service.getAll();
    }

    @GetMapping("/{id}")
    @Operation(
            summary = "Obtenir un Cycle par ID",
            description = "Retourne un Cycle à partir de son identifiant"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Cycle trouvé"),
            @ApiResponse(responseCode = "404", description = "Cycle introuvable")
    })
    public ResponseEntity<Cycle> get(@PathVariable String id) {

        logger.info("[CycleController] GET /api/cycles/{} - Récupération", id);

        return service.get(id)
                .map(Cycle -> {
                    logger.info("[CycleController] Cycle {} trouvé", id);
                    return ResponseEntity.ok(Cycle);
                })
                .orElseGet(() -> {
                    logger.warn("[CycleController] Cycle {} introuvable", id);
                    return ResponseEntity.notFound().build();
                });
    }

    @PostMapping
    @Operation(
            summary = "Créer un Cycle",
            description = "Crée un nouveau Cycle"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Cycle créé"),
            @ApiResponse(responseCode = "400", description = "Requête invalide")
    })
    public ResponseEntity<Cycle> create(@RequestBody CycleDTO dto) {

        logger.info("[CycleController] POST /api/cycles - Création d'un Cycle");

        Cycle instance = new Cycle();
        instance.fromDTO(dto);

        Cycle created = service.create(instance);

        logger.info("[CycleController] Cycle créé avec succès - ID: {}", created.getId());

        return ResponseEntity
                .created(URI.create("/api/cycles/" + created.getId()))
                .body(created);
    }

    @PutMapping("/{id}")
    @Operation(
            summary = "Mettre à jour un Cycle",
            description = "Met à jour un Cycle existant"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Cycle mis à jour"),
            @ApiResponse(responseCode = "404", description = "Cycle introuvable")
    })
    public ResponseEntity<Cycle> update(@PathVariable String id,
                                          @RequestBody CycleDTO dto) {

        logger.info("[CycleController] PUT /api/cycles/{} - Mise à jour", id);

        return service.get(id)
                .map(existing -> {

                    existing.fromDTO(dto);

                    Cycle updated = service.update(id, existing);

                    logger.info("[CycleController] Cycle {} mis à jour avec succès", id);

                    return ResponseEntity.ok(updated);
                })
                .orElseGet(() -> {
                    logger.warn("[CycleController] Cycle {} introuvable", id);
                    return ResponseEntity.notFound().build();
                });
    }

    @DeleteMapping("/{id}")
    @Operation(
            summary = "Supprimer un Cycle",
            description = "Supprime un Cycle"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Cycle supprimé"),
            @ApiResponse(responseCode = "404", description = "Cycle introuvable")
    })
    public ResponseEntity<Void> delete(@PathVariable String id) {

        logger.info("[CycleController] DELETE /api/cycles/{} - Suppression", id);

        if (service.get(id).isEmpty()) {
            logger.warn("[CycleController] Cycle {} introuvable", id);
            return ResponseEntity.notFound().build();
        }

        service.delete(id);

        logger.info("[CycleController] Cycle {} supprimé avec succès", id);

        return ResponseEntity.noContent().build();
    }
}