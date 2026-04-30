package com.deliberation.controller.deliberation;

import com.deliberation.dto.deliberation.DeliberationMentionDetailDTO;
import com.deliberation.model.deliberation.DeliberationMentionDetail;
import com.deliberation.model.inscription.Inscription;
import com.deliberation.service.deliberation.DeliberationMentionDetailService;
import com.deliberation.service.inscription.InscriptionService;
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
@RequestMapping("/api/deliberation_mention_details")
public class DeliberationMentionDetailController {

    private final DeliberationMentionDetailService service;
    private final InscriptionService inscriptionService;

    private static final Logger logger = LoggerFactory.getLogger(DeliberationMentionDetailController.class);

    public DeliberationMentionDetailController(
            DeliberationMentionDetailService service,
            InscriptionService inscriptionService
    ) {
        this.service = service;
        this.inscriptionService = inscriptionService;
    }

    @GetMapping
    @Operation(
            summary = "Lister les détails de délibération",
            description = "Retourne la liste complète des détails de délibération"
    )
    @ApiResponse(responseCode = "200", description = "Liste récupérée avec succès")
    public List<DeliberationMentionDetail> all() {
        logger.info("[DeliberationMentionDetailController] GET /api/deliberation_mention_details - Récupération");
        return service.getAll();
    }

    @GetMapping("/{id}")
    @Operation(
            summary = "Obtenir un détail de délibération par ID",
            description = "Retourne un détail à partir de son identifiant"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Détail trouvé"),
            @ApiResponse(responseCode = "404", description = "Détail introuvable")
    })
    public ResponseEntity<DeliberationMentionDetail> get(@PathVariable String id) {

        logger.info("[DeliberationMentionDetailController] GET /api/deliberation_mention_details/{} - Récupération", id);

        return service.get(id)
                .map(detail -> {
                    logger.info("[DeliberationMentionDetailController] Détail {} trouvé", id);
                    return ResponseEntity.ok(detail);
                })
                .orElseGet(() -> {
                    logger.warn("[DeliberationMentionDetailController] Détail {} introuvable", id);
                    return ResponseEntity.notFound().build();
                });
    }

    @PostMapping
    @Operation(
            summary = "Créer un détail de délibération",
            description = "Crée un nouveau détail lié à une inscription"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Détail créé"),
            @ApiResponse(responseCode = "400", description = "Requête invalide")
    })
    public ResponseEntity<DeliberationMentionDetail> create(@RequestBody DeliberationMentionDetailDTO dto) {

        logger.info("[DeliberationMentionDetailController] POST /api/deliberation_mention_details - Création");

        Inscription inscription = inscriptionService.get(dto.inscriptionId)
                .orElseThrow(() -> new IllegalArgumentException("Inscription introuvable"));

        DeliberationMentionDetail instance = new DeliberationMentionDetail();
        instance.fromDTO(dto, inscription);

        DeliberationMentionDetail created = service.create(instance);

        logger.info("[DeliberationMentionDetailController] Détail créé avec succès - ID: {}", created.getId());

        return ResponseEntity
                .created(URI.create("/api/deliberation_mention_details/" + created.getId()))
                .body(created);
    }

    @PutMapping("/{id}")
    @Operation(
            summary = "Mettre à jour un détail de délibération",
            description = "Met à jour un détail existant"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Détail mis à jour"),
            @ApiResponse(responseCode = "404", description = "Détail introuvable")
    })
    public ResponseEntity<DeliberationMentionDetail> update(
            @PathVariable String id,
            @RequestBody DeliberationMentionDetailDTO dto
    ) {

        logger.info("[DeliberationMentionDetailController] PUT /api/deliberation_mention_details/{} - Mise à jour", id);

        return service.get(id)
                .map(existing -> {

                    Inscription inscription = null;
                    if (dto.inscriptionId != null) {
                        inscription = inscriptionService.get(dto.inscriptionId)
                                .orElseThrow(() -> new IllegalArgumentException("Inscription introuvable"));
                        existing.setInscription(inscription);
                    }

                    existing.fromDTO(dto, inscription);

                    DeliberationMentionDetail updated = service.update(id, existing);

                    logger.info("[DeliberationMentionDetailController] Détail {} mis à jour avec succès", id);

                    return ResponseEntity.ok(updated);
                })
                .orElseGet(() -> {
                    logger.warn("[DeliberationMentionDetailController] Détail {} introuvable", id);
                    return ResponseEntity.notFound().build();
                });
    }

    @DeleteMapping("/{id}")
    @Operation(
            summary = "Supprimer un détail de délibération",
            description = "Supprime un détail"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Détail supprimé"),
            @ApiResponse(responseCode = "404", description = "Détail introuvable")
    })
    public ResponseEntity<Void> delete(@PathVariable String id) {

        logger.info("[DeliberationMentionDetailController] DELETE /api/deliberation_mention_details/{} - Suppression", id);

        if (service.get(id).isEmpty()) {
            logger.warn("[DeliberationMentionDetailController] Détail {} introuvable", id);
            return ResponseEntity.notFound().build();
        }

        service.delete(id);

        logger.info("[DeliberationMentionDetailController] Détail {} supprimé avec succès", id);

        return ResponseEntity.noContent().build();
    }
}