package com.deliberation.controller.inscription;

import com.deliberation.dto.inscription.MentionDTO;
import com.deliberation.model.inscription.Filiere;
import com.deliberation.model.inscription.Mention;
import com.deliberation.model.inscription.Niveau;
import com.deliberation.service.inscription.FiliereService;
import com.deliberation.service.inscription.MentionService;
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
@RequestMapping("/api/mentions")
public class MentionController {

    private final MentionService service;
    private final NiveauService niveauService;
    private final FiliereService filiereService;
    private static final Logger logger = LoggerFactory.getLogger(MentionController.class);

    public MentionController(MentionService service,
                             NiveauService niveauService,
                             FiliereService filiereService) {
        this.service = service;
        this.niveauService = niveauService;
        this.filiereService = filiereService;
    }

    @GetMapping
    @Operation(
            summary = "Lister les mentions",
            description = "Retourne la liste complète des mentions"
    )
    @ApiResponse(responseCode = "200", description = "Liste récupérée avec succès")
    public List<Mention> all() {
        logger.info("[MentionController] GET /api/mentions - Récupération de toutes les mentions");
        return service.getAll();
    }

    @GetMapping("/{id}")
    @Operation(
            summary = "Obtenir une mention par ID",
            description = "Retourne une mention à partir de son identifiant"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Mention trouvée"),
            @ApiResponse(responseCode = "404", description = "Mention introuvable")
    })
    public ResponseEntity<Mention> get(@PathVariable String id) {

        logger.info("[MentionController] GET /api/mentions/{} - Récupération", id);

        return service.get(id)
                .map(mention -> {
                    logger.info("[MentionController] Mention {} trouvée", id);
                    return ResponseEntity.ok(mention);
                })
                .orElseGet(() -> {
                    logger.warn("[MentionController] Mention {} introuvable", id);
                    return ResponseEntity.notFound().build();
                });
    }

    @PostMapping
    @Operation(
            summary = "Créer une mention",
            description = "Crée une nouvelle mention liée à un niveau et une filière"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Mention créée"),
            @ApiResponse(responseCode = "400", description = "Requête invalide")
    })
    public ResponseEntity<Mention> create(@RequestBody MentionDTO dto) {

        logger.info("[MentionController] POST /api/mentions - Création d'une mention");

        Niveau niveau = niveauService.get(dto.niveauId)
                .orElseThrow(() -> new IllegalArgumentException("Niveau introuvable"));

        Filiere filiere = filiereService.get(dto.filiereId)
                .orElseThrow(() -> new IllegalArgumentException("Filière introuvable"));

        Mention instance = new Mention();
        instance.fromDTO(dto, niveau, filiere);

        Mention created = service.create(instance);

        logger.info("[MentionController] Mention créée avec succès - ID: {}", created.getId());

        return ResponseEntity
                .created(URI.create("/api/mentions/" + created.getId()))
                .body(created);
    }

    @PutMapping("/{id}")
    @Operation(
            summary = "Mettre à jour une mention",
            description = "Met à jour une mention existante"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Mention mise à jour"),
            @ApiResponse(responseCode = "404", description = "Mention introuvable")
    })
    public ResponseEntity<Mention> update(@PathVariable String id,
                                          @RequestBody MentionDTO dto) {

        logger.info("[MentionController] PUT /api/mentions/{} - Mise à jour", id);

        return service.get(id)
                .map(existing -> {

                    if (dto.niveauId != null) {
                        Niveau niveau = niveauService.get(dto.niveauId)
                                .orElseThrow(() -> new IllegalArgumentException("Niveau introuvable"));
                        existing.setNiveau(niveau);
                    }

                    if (dto.filiereId != null) {
                        Filiere filiere = filiereService.get(dto.filiereId)
                                .orElseThrow(() -> new IllegalArgumentException("Filière introuvable"));
                        existing.setFiliere(filiere);
                    }

                    existing.fromDTO(dto, null, null);

                    Mention updated = service.update(id, existing);

                    logger.info("[MentionController] Mention {} mise à jour avec succès", id);

                    return ResponseEntity.ok(updated);
                })
                .orElseGet(() -> {
                    logger.warn("[MentionController] Mention {} introuvable", id);
                    return ResponseEntity.notFound().build();
                });
    }

    @DeleteMapping("/{id}")
    @Operation(
            summary = "Supprimer une mention",
            description = "Supprime une mention"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Mention supprimée"),
            @ApiResponse(responseCode = "404", description = "Mention introuvable")
    })
    public ResponseEntity<Void> delete(@PathVariable String id) {

        logger.info("[MentionController] DELETE /api/mentions/{} - Suppression", id);

        if (service.get(id).isEmpty()) {
            logger.warn("[MentionController] Mention {} introuvable", id);
            return ResponseEntity.notFound().build();
        }

        service.delete(id);

        logger.info("[MentionController] Mention {} supprimée avec succès", id);

        return ResponseEntity.noContent().build();
    }
}