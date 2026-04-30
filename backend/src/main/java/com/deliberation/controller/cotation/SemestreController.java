package com.deliberation.controller.cotation;

import com.deliberation.dto.cotation.SemestreDTO;
import com.deliberation.model.cotation.Semestre;
import com.deliberation.model.inscription.Niveau;
import com.deliberation.service.cotation.SemestreService;
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
@RequestMapping("/api/semestres")
public class SemestreController {

    private final SemestreService service;
    private final NiveauService niveauService;

    private static final Logger logger = LoggerFactory.getLogger(SemestreController.class);

    public SemestreController(SemestreService service, NiveauService niveauService) {
        this.service = service;
        this.niveauService = niveauService;
    }

    @GetMapping
    @Operation(
            summary = "Lister les semestres",
            description = "Retourne la liste complète des semestres"
    )
    @ApiResponse(responseCode = "200", description = "Liste récupérée avec succès")
    public List<Semestre> all() {
        logger.info("[SemestreController] GET /api/semestres - Récupération de tous les semestres");
        return service.getAll();
    }

    @GetMapping("/{id}")
    @Operation(
            summary = "Obtenir un semestre par ID",
            description = "Retourne un semestre à partir de son identifiant"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Semestre trouvé"),
            @ApiResponse(responseCode = "404", description = "Semestre introuvable")
    })
    public ResponseEntity<Semestre> get(@PathVariable String id) {

        logger.info("[SemestreController] GET /api/semestres/{} - Récupération", id);

        return service.get(id)
                .map(semestre -> {
                    logger.info("[SemestreController] Semestre {} trouvé", id);
                    return ResponseEntity.ok(semestre);
                })
                .orElseGet(() -> {
                    logger.warn("[SemestreController] Semestre {} introuvable", id);
                    return ResponseEntity.notFound().build();
                });
    }

    @PostMapping
    @Operation(
            summary = "Créer un semestre",
            description = "Crée un nouveau semestre lié à un niveau"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Semestre créé"),
            @ApiResponse(responseCode = "400", description = "Requête invalide")
    })
    public ResponseEntity<Semestre> create(@RequestBody SemestreDTO dto) {

        logger.info("[SemestreController] POST /api/semestres - Création d'un semestre");

        Niveau niveau = niveauService.get(dto.niveauId)
                .orElseThrow(() -> new IllegalArgumentException("Niveau introuvable"));

        Semestre instance = new Semestre();
        instance.fromDTO(dto, niveau);

        Semestre created = service.create(instance);

        logger.info("[SemestreController] Semestre créé avec succès - ID: {}", created.getId());

        return ResponseEntity
                .created(URI.create("/api/semestres/" + created.getId()))
                .body(created);
    }

    @PutMapping("/{id}")
    @Operation(
            summary = "Mettre à jour un semestre",
            description = "Met à jour un semestre existant"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Semestre mis à jour"),
            @ApiResponse(responseCode = "404", description = "Semestre introuvable")
    })
    public ResponseEntity<Semestre> update(@PathVariable String id,
                                           @RequestBody SemestreDTO dto) {

        logger.info("[SemestreController] PUT /api/semestres/{} - Mise à jour", id);

        return service.get(id)
                .map(existing -> {

                    Niveau niveau = null;
                    if (dto.niveauId != null) {
                        niveau = niveauService.get(dto.niveauId)
                                .orElseThrow(() -> new IllegalArgumentException("Niveau introuvable"));
                    }

                    existing.fromDTO(dto, niveau);

                    Semestre updated = service.update(id, existing);

                    logger.info("[SemestreController] Semestre {} mis à jour avec succès", id);

                    return ResponseEntity.ok(updated);
                })
                .orElseGet(() -> {
                    logger.warn("[SemestreController] Semestre {} introuvable", id);
                    return ResponseEntity.notFound().build();
                });
    }

    @DeleteMapping("/{id}")
    @Operation(
            summary = "Supprimer un semestre",
            description = "Supprime un semestre"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Semestre supprimé"),
            @ApiResponse(responseCode = "404", description = "Semestre introuvable")
    })
    public ResponseEntity<Void> delete(@PathVariable String id) {

        logger.info("[SemestreController] DELETE /api/semestres/{} - Suppression", id);

        if (service.get(id).isEmpty()) {
            logger.warn("[SemestreController] Semestre {} introuvable", id);
            return ResponseEntity.notFound().build();
        }

        service.delete(id);

        logger.info("[SemestreController] Semestre {} supprimé avec succès", id);

        return ResponseEntity.noContent().build();
    }
}