package com.deliberation.controller.inscription;

import com.deliberation.dto.inscription.DomaineDTO;
import com.deliberation.model.inscription.Domaine;
import com.deliberation.service.inscription.DomaineService;
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
@RequestMapping("/api/domaines")
public class DomaineController {

    private final DomaineService service;
    private static final Logger logger = LoggerFactory.getLogger(DomaineController.class);

    public DomaineController(DomaineService service) {
        this.service = service;
    }

    @GetMapping
    @Operation(
            summary = "Lister les domaines",
            description = "Retourne la liste complète des domaines"
    )
    @ApiResponse(responseCode = "200", description = "Liste récupérée avec succès")
    public List<Domaine> all() {
        logger.info("[DomaineController] GET /api/domaines - Récupération de tous les domaines");
        return service.getAll();
    }

    @GetMapping("/{id}")
    @Operation(
            summary = "Obtenir un domaine par ID",
            description = "Retourne un domaine à partir de son identifiant"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Domaine trouvé"),
            @ApiResponse(responseCode = "404", description = "Domaine introuvable")
    })
    public ResponseEntity<Domaine> get(@PathVariable String id) {

        logger.info("[DomaineController] GET /api/domaines/{} - Récupération", id);

        return service.get(id)
                .map(domaine -> {
                    logger.info("[DomaineController] Domaine {} trouvé", id);
                    return ResponseEntity.ok(domaine);
                })
                .orElseGet(() -> {
                    logger.warn("[DomaineController] Domaine {} introuvable", id);
                    return ResponseEntity.notFound().build();
                });
    }

    @PostMapping
    @Operation(
            summary = "Créer un domaine",
            description = "Crée un nouveau domaine"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Domaine créé"),
            @ApiResponse(responseCode = "400", description = "Requête invalide")
    })
    public ResponseEntity<Domaine> create(@RequestBody DomaineDTO dto) {

        logger.info("[DomaineController] POST /api/domaines - Création d'un domaine");

        Domaine instance = new Domaine();
        instance.fromDTO(dto);

        Domaine created = service.create(instance);

        logger.info("[DomaineController] Domaine créé avec succès - ID: {}", created.getId());

        return ResponseEntity
                .created(URI.create("/api/domaines/" + created.getId()))
                .body(created);
    }

    @PutMapping("/{id}")
    @Operation(
            summary = "Mettre à jour un domaine",
            description = "Met à jour un domaine existant"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Domaine mis à jour"),
            @ApiResponse(responseCode = "404", description = "Domaine introuvable")
    })
    public ResponseEntity<Domaine> update(@PathVariable String id,
                                          @RequestBody DomaineDTO dto) {

        logger.info("[DomaineController] PUT /api/domaines/{} - Mise à jour", id);

        return service.get(id)
                .map(existing -> {

                    existing.fromDTO(dto);

                    Domaine updated = service.update(id, existing);

                    logger.info("[DomaineController] Domaine {} mis à jour avec succès", id);

                    return ResponseEntity.ok(updated);
                })
                .orElseGet(() -> {
                    logger.warn("[DomaineController] Domaine {} introuvable", id);
                    return ResponseEntity.notFound().build();
                });
    }

    @DeleteMapping("/{id}")
    @Operation(
            summary = "Supprimer un domaine",
            description = "Supprime un domaine"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Domaine supprimé"),
            @ApiResponse(responseCode = "404", description = "Domaine introuvable")
    })
    public ResponseEntity<Void> delete(@PathVariable String id) {

        logger.info("[DomaineController] DELETE /api/domaines/{} - Suppression", id);

        if (service.get(id).isEmpty()) {
            logger.warn("[DomaineController] Domaine {} introuvable", id);
            return ResponseEntity.notFound().build();
        }

        service.delete(id);

        logger.info("[DomaineController] Domaine {} supprimé avec succès", id);

        return ResponseEntity.noContent().build();
    }
}