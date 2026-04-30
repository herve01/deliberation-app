package com.deliberation.controller.cotation;

import com.deliberation.dto.cotation.MentionEcueDetailDTO;
import com.deliberation.model.cotation.MentionEcueDetail;
import com.deliberation.model.cotation.Ecue;
import com.deliberation.model.cotation.Semestre;
import com.deliberation.model.inscription.Mention;
import com.deliberation.service.cotation.MentionEcueDetailService;
import com.deliberation.service.cotation.EcueService;
import com.deliberation.service.cotation.SemestreService;
import com.deliberation.service.inscription.MentionService;
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
@RequestMapping("/api/mention_ecue_details")
public class MentionEcueDetailController {

    private final MentionEcueDetailService service;
    private final MentionService mentionService;
    private final EcueService ecueService;
    private final SemestreService semestreService;

    private static final Logger logger = LoggerFactory.getLogger(MentionEcueDetailController.class);

    public MentionEcueDetailController(
            MentionEcueDetailService service,
            MentionService mentionService,
            EcueService ecueService,
            SemestreService semestreService
    ) {
        this.service = service;
        this.mentionService = mentionService;
        this.ecueService = ecueService;
        this.semestreService = semestreService;
    }

    @GetMapping
    @Operation(
            summary = "Lister les détails mention-ECUE",
            description = "Retourne la liste complète des détails mention-ECUE"
    )
    @ApiResponse(responseCode = "200", description = "Liste récupérée avec succès")
    public List<MentionEcueDetail> all() {
        logger.info("[MentionEcueDetailController] GET /api/mention_ecue_details - Récupération");
        return service.getAll();
    }

    @GetMapping("/{id}")
    @Operation(
            summary = "Obtenir un détail mention-ECUE par ID",
            description = "Retourne un détail mention-ECUE à partir de son identifiant"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Détail trouvé"),
            @ApiResponse(responseCode = "404", description = "Détail introuvable")
    })
    public ResponseEntity<MentionEcueDetail> get(@PathVariable String id) {

        logger.info("[MentionEcueDetailController] GET /api/mention_ecue_details/{} - Récupération", id);

        return service.get(id)
                .map(detail -> {
                    logger.info("[MentionEcueDetailController] Détail {} trouvé", id);
                    return ResponseEntity.ok(detail);
                })
                .orElseGet(() -> {
                    logger.warn("[MentionEcueDetailController] Détail {} introuvable", id);
                    return ResponseEntity.notFound().build();
                });
    }

    @PostMapping
    @Operation(
            summary = "Créer un détail mention-ECUE",
            description = "Crée un nouveau lien entre mention, ECUE et semestre"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Détail créé"),
            @ApiResponse(responseCode = "400", description = "Requête invalide")
    })
    public ResponseEntity<MentionEcueDetail> create(@RequestBody MentionEcueDetailDTO dto) {

        logger.info("[MentionEcueDetailController] POST /api/mention_ecue_details - Création");

        Mention mention = mentionService.get(dto.mentionId)
                .orElseThrow(() -> new IllegalArgumentException("Mention introuvable"));

        Ecue ecue = ecueService.get(dto.ecueId)
                .orElseThrow(() -> new IllegalArgumentException("ECUE introuvable"));

        Semestre semestre = semestreService.get(dto.semestreId)
                .orElseThrow(() -> new IllegalArgumentException("Semestre introuvable"));

        MentionEcueDetail instance = new MentionEcueDetail();
        instance.fromDTO(dto, mention, ecue, semestre);

        MentionEcueDetail created = service.create(instance);

        logger.info("[MentionEcueDetailController] Détail créé avec succès - ID: {}", created.getId());

        return ResponseEntity
                .created(URI.create("/api/mention_ecue_details/" + created.getId()))
                .body(created);
    }

    @PutMapping("/{id}")
    @Operation(
            summary = "Mettre à jour un détail mention-ECUE",
            description = "Met à jour un détail existant"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Détail mis à jour"),
            @ApiResponse(responseCode = "404", description = "Détail introuvable")
    })
    public ResponseEntity<MentionEcueDetail> update(
            @PathVariable String id,
            @RequestBody MentionEcueDetailDTO dto
    ) {

        logger.info("[MentionEcueDetailController] PUT /api/mention_ecue_details/{} - Mise à jour", id);

        return service.get(id)
                .map(existing -> {

                    Mention mention = null;
                    if (dto.mentionId != null) {
                        mention = mentionService.get(dto.mentionId)
                                .orElseThrow(() -> new IllegalArgumentException("Mention introuvable"));
                        existing.setMention(mention);
                    }

                    Ecue ecue = null;
                    if (dto.ecueId != null) {
                        ecue = ecueService.get(dto.ecueId)
                                .orElseThrow(() -> new IllegalArgumentException("ECUE introuvable"));
                        existing.setEcue(ecue);
                    }

                    Semestre semestre = null;
                    if (dto.semestreId != null) {
                        semestre = semestreService.get(dto.semestreId)
                                .orElseThrow(() -> new IllegalArgumentException("Semestre introuvable"));
                        existing.setSemestre(semestre);
                    }

                    existing.fromDTO(dto, null, null, null);

                    MentionEcueDetail updated = service.update(id, existing);

                    logger.info("[MentionEcueDetailController] Détail {} mis à jour avec succès", id);

                    return ResponseEntity.ok(updated);
                })
                .orElseGet(() -> {
                    logger.warn("[MentionEcueDetailController] Détail {} introuvable", id);
                    return ResponseEntity.notFound().build();
                });
    }

    @DeleteMapping("/{id}")
    @Operation(
            summary = "Supprimer un détail mention-ECUE",
            description = "Supprime un détail"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Détail supprimé"),
            @ApiResponse(responseCode = "404", description = "Détail introuvable")
    })
    public ResponseEntity<Void> delete(@PathVariable String id) {

        logger.info("[MentionEcueDetailController] DELETE /api/mention_ecue_details/{} - Suppression", id);

        if (service.get(id).isEmpty()) {
            logger.warn("[MentionEcueDetailController] Détail {} introuvable", id);
            return ResponseEntity.notFound().build();
        }

        service.delete(id);

        logger.info("[MentionEcueDetailController] Détail {} supprimé avec succès", id);

        return ResponseEntity.noContent().build();
    }
}