package com.deliberation.controller.inscription;

import com.deliberation.dto.inscription.NiveauDTO;
import com.deliberation.model.inscription.Cycle;
import com.deliberation.model.inscription.Domaine;
import com.deliberation.model.inscription.Niveau;
import com.deliberation.service.inscription.CycleService;
import com.deliberation.service.inscription.NiveauService;
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
@RequestMapping("/api/niveaux")
public class NiveauController {

    private final NiveauService service;
    private final CycleService cycleService;
    private static final Logger logger = LoggerFactory.getLogger(NiveauController.class);

    public NiveauController(NiveauService service, CycleService cycleService) {
        this.service = service;
        this.cycleService = cycleService;
    }

    @GetMapping
    @Operation(
            summary = "Lister les niveaux",
            description = "Retourne la liste complète des niveaux"
    )
    @ApiResponse(responseCode = "200", description = "Liste récupérée avec succès")
    public List<Niveau> all() {
        logger.info("[NiveauController] GET /api/niveaux - Récupération de tous les niveaux");
        return service.getAll();
    }

    @GetMapping("/all/{isOldSystem}")
    @Operation(
            summary = "Lister les niveaux",
            description = "Retourne la liste complète des niveaux selon le système"
    )
    @ApiResponse(
            responseCode = "200",
            description = "Liste des niveaux récupérée avec succès"
    )
    public List<Niveau> all(@PathVariable("isOldSystem") Boolean isOldSystem) {

        logger.info(
                "[NiveauController] GET /api/niveaux/all/{} - Récupération des niveaux",
                isOldSystem
        );

        return service.getAll(isOldSystem);
    }

    @GetMapping("/{id}")
    @Operation(
            summary = "Obtenir un niveau par ID",
            description = "Retourne un niveau à partir de son identifiant"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Niveau trouvé"),
            @ApiResponse(responseCode = "404", description = "Niveau introuvable")
    })
    public ResponseEntity<Niveau> get(@PathVariable String id) {

        logger.info("[NiveauController] GET /api/niveaux/{} - Récupération", id);

        return service.get(id)
                .map(instance -> {
                    logger.info("[NiveauController] Niveau {} trouvé", id);
                    return ResponseEntity.ok(instance);
                })
                .orElseGet(() -> {
                    logger.warn("[NiveauController] Niveau {} introuvable", id);
                    return ResponseEntity.notFound().build();
                });
    }

    @PostMapping
    @Operation(
            summary = "Créer un niveau",
            description = "Crée un nouveau niveau"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Niveau créé"),
            @ApiResponse(responseCode = "400", description = "Requête invalide")
    })
    public ResponseEntity<Niveau> create(@RequestBody NiveauDTO dto) {

        logger.info("[NiveauController] POST /api/niveaux - Création d'un niveau");

        Cycle cycle = cycleService.get(dto.cycleId)
                .orElseThrow(() -> new IllegalArgumentException("Domaine introuvable"));

        Niveau instance = new Niveau();
        instance.fromDTO(dto, cycle);

        Niveau created = service.create(instance);

        logger.info("[NiveauController] Niveau créé avec succès - ID: {}", created.getId());

        return ResponseEntity
                .created(URI.create("/api/niveaux/" + created.getId()))
                .body(created);
    }

    @PutMapping("/{id}")
    @Operation(
            summary = "Mettre à jour un niveau",
            description = "Met à jour un niveau existant"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Niveau mis à jour"),
            @ApiResponse(responseCode = "404", description = "Niveau introuvable")
    })
    public ResponseEntity<Niveau> update(@PathVariable String id,
                                         @RequestBody NiveauDTO dto) {

        logger.info("[NiveauController] PUT /api/niveaux/{} - Mise à jour", id);

        return service.get(id)
                .map(existing -> {


                    Cycle cycle = null;
                    if (dto.cycleId != null) {
                        cycle = cycleService.get(dto.cycleId)
                                .orElseThrow(() -> new IllegalArgumentException("Domaine introuvable"));

                        existing.setCycle(cycle);
                    }
                    existing.fromDTO(dto, null);

                    Niveau updated = service.update(id, existing);

                    logger.info("[NiveauController] Niveau {} mis à jour avec succès", id);

                    return ResponseEntity.ok(updated);
                })
                .orElseGet(() -> {
                    logger.warn("[NiveauController] Niveau {} introuvable", id);
                    return ResponseEntity.notFound().build();
                });
    }

    @DeleteMapping("/{id}")
    @Operation(
            summary = "Supprimer un niveau",
            description = "Supprime un niveau"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Niveau supprimé"),
            @ApiResponse(responseCode = "404", description = "Niveau introuvable")
    })
    public ResponseEntity<Void> delete(@PathVariable String id) {

        logger.info("[NiveauController] DELETE /api/niveaux/{} - Suppression", id);

        if (service.get(id).isEmpty()) {
            logger.warn("[NiveauController] Niveau {} introuvable", id);
            return ResponseEntity.notFound().build();
        }

        service.delete(id);

        logger.info("[NiveauController] Niveau {} supprimé avec succès", id);

        return ResponseEntity.noContent().build();
    }
}