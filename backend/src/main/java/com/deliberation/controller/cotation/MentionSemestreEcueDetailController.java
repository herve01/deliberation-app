package com.deliberation.controller.cotation;

import com.deliberation.dto.cotation.MentionSemestreEcueDetailDTO;
import com.deliberation.model.cotation.*;
import com.deliberation.model.cotation.pojo.MentionSemestreEcuePojo;
import com.deliberation.service.cotation.*;
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
@RequestMapping("/api/mention_semestre_ecue_details")
public class MentionSemestreEcueDetailController {

    private static final Logger logger =
            LoggerFactory.getLogger(MentionSemestreEcueDetailController.class);

    private final MentionSemestreEcueDetailService service;
    private final CategorieService categorieService;
    private final EcueService ecueService;
    private final MentionSemestreEcueService mentionService;

    public MentionSemestreEcueDetailController(
            MentionSemestreEcueDetailService service,
            CategorieService categorieService,
            EcueService ecueService,
            MentionSemestreEcueService mentionService
    ) {
        this.service = service;
        this.categorieService = categorieService;
        this.ecueService = ecueService;
        this.mentionService = mentionService;
    }

    @GetMapping
    @Operation(
            summary = "Lister les détails mention-ECUE",
            description = "Retourne la liste complète des détails mention-ECUE"
    )
    @ApiResponse(responseCode = "200", description = "Liste récupérée avec succès")
    public List<MentionSemestreEcueDetail> all() {

        logger.info("[MentionSemestreEcueDetailController] GET /api/mention_semestre_ecue_details - Récupération");

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
    public ResponseEntity<MentionSemestreEcueDetail> get(@PathVariable String id) {

        logger.info("[MentionSemestreEcueDetailController] GET /api/mention_semestre_ecue_details/{} - Récupération", id);

        return service.get(id).map(detail -> {
                logger.info("[MentionSemestreEcueDetailController] Détail {} trouvé", id);

                return ResponseEntity.ok(detail);
            })
            .orElseGet(() -> {logger.warn("[MentionSemestreEcueDetailController] Détail {} introuvable", id);

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
    public ResponseEntity<MentionSemestreEcueDetail> create(@RequestBody MentionSemestreEcueDetailDTO dto) {

        logger.info("[MentionSemestreEcueDetailController] POST /api/mention_semestre_ecue_details - Création");

        var categorie = categorieService.get(dto.categorieId).orElseThrow(() -> 
                        new IllegalArgumentException("Catégorie introuvable"));

        var mention = mentionService.get(dto.mentionSemestreEcueId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Mention semestre ECUE introuvable"));

        var ecue = ecueService.get(dto.ecueId)
                .orElseThrow(() ->
                        new IllegalArgumentException("ECUE introuvable"));

        var instance = new MentionSemestreEcueDetail();
        instance.fromDTO(dto, mention, categorie, ecue);

        var created = service.create(instance);

        logger.info("[MentionSemestreEcueDetailController] Détail créé avec succès - ID: {}",
                created.getId());

        return ResponseEntity
                .created(URI.create("/api/mention_semestre_ecue_details/" + created.getId()
                )).body(created);
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
    public ResponseEntity<MentionSemestreEcueDetail> update(@PathVariable String id, @RequestBody MentionSemestreEcueDetailDTO dto) {

        logger.info("[MentionSemestreEcueDetailController] PUT /api/mention_semestre_ecue_details/{} - Mise à jour", id);

        return service.get(id)
            .map(existing -> {

                if (dto.categorieId != null) {
                    var categorie = categorieService.get(dto.categorieId)
                            .orElseThrow(() -> new IllegalArgumentException("Catégorie introuvable"));

                    existing.setCategorie(categorie);
                }

                if (dto.mentionSemestreEcueId != null) {
                    var mention = mentionService.get(dto.mentionSemestreEcueId)
                            .orElseThrow(() ->
                                    new IllegalArgumentException("Mention introuvable"));

                    existing.setMentionSemestre(mention);
                }

                if (dto.ecueId != null) {
                    var ecue = ecueService.get(dto.ecueId)
                            .orElseThrow(() -> new IllegalArgumentException("ECUE introuvable"));

                    existing.setEcue(ecue);
                }

                existing.fromDTO(dto, null, null, null);

                var updated = service.update(id, existing);

                logger.info("[MentionSemestreEcueDetailController] Détail {} mis à jour avec succès", id);

                return ResponseEntity.ok(updated);
            })
            .orElseGet(() -> {

                logger.warn("[MentionSemestreEcueDetailController] Détail {} introuvable", id);

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

        logger.info("[MentionSemestreEcueDetailController] DELETE /api/mention_semestre_ecue_details/{} - Suppression", id);

        if (service.get(id).isEmpty()) {

            logger.warn("[MentionSemestreEcueDetailController] Détail {} introuvable", id);

            return ResponseEntity.notFound().build();
        }

        service.delete(id);

        logger.info("[MentionSemestreEcueDetailController] Détail {} supprimé avec succès", id);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/mention/{mentionId}/annee/{anneeId}/semestre/{semestreId}")
    @Operation(
            summary = "Lister les détails mention-ECUE",
            description = "Retourne la liste des détails mention-ECUE avec statistiques de cotation"
    )
    @ApiResponse(responseCode = "200", description = "Liste récupérée avec succès")
    public List<MentionSemestreEcueDetail> all(@PathVariable String mentionId, @PathVariable String anneeId, @PathVariable String semestreId) {

        logger.info("[MentionSemestreEcueDetailController] GET /api/mention_semestre_ecue_details - Récupération");

        var mentionSemestre = mentionService.getOne(mentionId, semestreId, anneeId)
                .orElseThrow(() -> new IllegalArgumentException("Mention semestre introuvable"));

        return service.getAll(mentionSemestre.getId())
                .stream()
                .map(detail -> {
                    detail.setMentionSemestre(mentionSemestre);
                    return detail;
                })
                .toList();
    }
}