package com.deliberation.controller.inscription;

import com.deliberation.dto.inscription.FiliereDTO;
import com.deliberation.model.inscription.Domaine;
import com.deliberation.model.inscription.Filiere;
import com.deliberation.service.inscription.DomaineService;
import com.deliberation.service.inscription.FiliereService;
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
@RequestMapping("/api/filieres")
public class FiliereController {

    private final FiliereService service;
    private final DomaineService domaineService;
    private static final Logger logger = LoggerFactory.getLogger(FiliereController.class);

    public FiliereController(FiliereService service, DomaineService domaineService) {
        this.service = service;
        this.domaineService = domaineService;
    }

    @GetMapping
    @Operation(
            summary = "Lister les filières",
            description = "Retourne la liste complète des filières"
    )
    @ApiResponse(responseCode = "200", description = "Liste récupérée avec succès")
    public List<Filiere> all() {
        logger.info("[FiliereController] GET /api/filieres - Récupération de toutes les filières");
        return service.getAll();
    }

    @GetMapping("/{id}")
    @Operation(
            summary = "Obtenir une filière par ID",
            description = "Retourne une filière à partir de son identifiant"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Filière trouvée"),
            @ApiResponse(responseCode = "404", description = "Filière introuvable")
    })
    public ResponseEntity<Filiere> get(@PathVariable String id) {

        logger.info("[FiliereController] GET /api/filieres/{} - Récupération", id);

        return service.get(id)
                .map(filiere -> {
                    logger.info("[FiliereController] Filière {} trouvée", id);
                    return ResponseEntity.ok(filiere);
                })
                .orElseGet(() -> {
                    logger.warn("[FiliereController] Filière {} introuvable", id);
                    return ResponseEntity.notFound().build();
                });
    }

    @PostMapping
    @Operation(
            summary = "Créer une filière",
            description = "Crée une nouvelle filière liée à un domaine"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Filière créée"),
            @ApiResponse(responseCode = "400", description = "Requête invalide")
    })
    public ResponseEntity<Filiere> create(@RequestBody FiliereDTO dto) {

        logger.info("[FiliereController] POST /api/filieres - Création d'une filière");

        Domaine domaine = domaineService.get(dto.domaineId)
                .orElseThrow(() -> new IllegalArgumentException("Domaine introuvable"));

        Filiere instance = new Filiere();
        instance.fromDTO(dto, domaine);

        Filiere created = service.create(instance);

        logger.info("[FiliereController] Filière créée avec succès - ID: {}", created.getId());

        return ResponseEntity
                .created(URI.create("/api/filieres/" + created.getId()))
                .body(created);
    }

    @PutMapping("/{id}")
    @Operation(
            summary = "Mettre à jour une filière",
            description = "Met à jour une filière existante"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Filière mise à jour"),
            @ApiResponse(responseCode = "404", description = "Filière introuvable")
    })
    public ResponseEntity<Filiere> update(@PathVariable String id,
                                          @RequestBody FiliereDTO dto) {

        logger.info("[FiliereController] PUT /api/filieres/{} - Mise à jour", id);

        return service.get(id)
                .map(existing -> {

                    Domaine domaine = null;
                    if (dto.domaineId != null) {
                        domaine = domaineService.get(dto.domaineId)
                                .orElseThrow(() -> new IllegalArgumentException("Domaine introuvable"));
                    }

                    existing.fromDTO(dto, domaine);

                    Filiere updated = service.update(id, existing);

                    logger.info("[FiliereController] Filière {} mise à jour avec succès", id);

                    return ResponseEntity.ok(updated);
                })
                .orElseGet(() -> {
                    logger.warn("[FiliereController] Filière {} introuvable", id);
                    return ResponseEntity.notFound().build();
                });
    }

    @DeleteMapping("/{id}")
    @Operation(
            summary = "Supprimer une filière",
            description = "Supprime une filière"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Filière supprimée"),
            @ApiResponse(responseCode = "404", description = "Filière introuvable")
    })
    public ResponseEntity<Void> delete(@PathVariable String id) {

        logger.info("[FiliereController] DELETE /api/filieres/{} - Suppression", id);

        if (service.get(id).isEmpty()) {
            logger.warn("[FiliereController] Filière {} introuvable", id);
            return ResponseEntity.notFound().build();
        }

        service.delete(id);

        logger.info("[FiliereController] Filière {} supprimée avec succès", id);

        return ResponseEntity.noContent().build();
    }
}