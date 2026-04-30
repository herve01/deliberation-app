package com.deliberation.controller.inscription;

import com.deliberation.dto.inscription.AnneeAcademiqueDTO;
import com.deliberation.model.inscription.AnneeAcademique;
import com.deliberation.service.inscription.AnneeService;
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
@RequestMapping("/api/annees")
public class AnneeController {

    private final AnneeService service;
    private static final Logger logger = LoggerFactory.getLogger(AnneeController.class);

    public AnneeController(AnneeService service) {
        this.service = service;
    }

    @GetMapping
    @Operation(
            summary = "Lister les années académiques",
            description = "Retourne la liste complète des années académiques"
    )
    public List<AnneeAcademique> all() {
        logger.info("[AnneeController] GET /api/annees - Récupération de toutes les années académiques");
        return service.getAll();
    }

    @GetMapping("/{id}")
    @Operation(
            summary = "Obtenir une année académique par ID",
            description = "Retourne une année académique à partir de son identifiant"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Année trouvée"),
            @ApiResponse(responseCode = "404", description = "Année introuvable")
    })
    public ResponseEntity<AnneeAcademique> get(@PathVariable String id) {

        logger.info("[AnneeController] GET /api/annees/{} - Récupération", id);

        return service.get(id)
                .map(instance -> {
                    logger.info("[AnneeController] Année {} trouvée", id);
                    return ResponseEntity.ok(instance);
                })
                .orElseGet(() -> {
                    logger.warn("[AnneeController] Année {} introuvable", id);
                    return ResponseEntity.notFound().build();
                });
    }

    @PostMapping
    @Operation(
            summary = "Créer une année académique",
            description = "Crée une nouvelle année académique à partir des données fournies"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Année créée avec succès"),
            @ApiResponse(responseCode = "400", description = "Requête invalide")
    })
    public ResponseEntity<AnneeAcademique> create(@RequestBody AnneeAcademiqueDTO dto) {

        logger.info("[AnneeController] POST /api/annees - Création d'une année académique");

        AnneeAcademique instance = new AnneeAcademique();
        instance.fromDTO(dto);

        AnneeAcademique created = service.create(instance);

        logger.info("[AnneeController] Année créée avec succès - ID: {}", created.getId());

        return ResponseEntity
                .created(URI.create("/api/annees/" + created.getId()))
                .body(created);
    }

    @PutMapping("/{id}")
    @Operation(
            summary = "Mettre à jour une année académique",
            description = "Met à jour les informations d'une année académique existante"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Année mise à jour"),
            @ApiResponse(responseCode = "404", description = "Année introuvable")
    })
    public ResponseEntity<AnneeAcademique> update(@PathVariable String id,
                                                  @RequestBody AnneeAcademiqueDTO dto) {

        logger.info("[AnneeController] PUT /api/annees/{} - Mise à jour", id);

        return service.get(id)
                .map(existing -> {

                    existing.fromDTO(dto);

                    AnneeAcademique updated = service.update(id, existing);

                    logger.info("[AnneeController] Année {} mise à jour avec succès", id);

                    return ResponseEntity.ok(updated);
                })
                .orElseGet(() -> {
                    logger.warn("[AnneeController] Année {} introuvable pour mise à jour", id);
                    return ResponseEntity.notFound().build();
                });
    }

    @DeleteMapping("/{id}")
    @Operation(
            summary = "Supprimer une année académique",
            description = "Supprime une année académique à partir de son identifiant"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Année supprimée"),
            @ApiResponse(responseCode = "404", description = "Année introuvable")
    })
    public ResponseEntity<Void> delete(@PathVariable String id) {

        logger.info("[AnneeController] DELETE /api/annees/{} - Suppression", id);

        if (service.get(id).isEmpty()) {
            logger.warn("[AnneeController] Année {} introuvable pour suppression", id);
            return ResponseEntity.notFound().build();
        }

        service.delete(id);

        logger.info("[AnneeController] Année {} supprimée avec succès", id);

        return ResponseEntity.noContent().build();
    }
}