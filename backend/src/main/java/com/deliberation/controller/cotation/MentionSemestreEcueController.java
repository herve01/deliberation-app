package com.deliberation.controller.cotation;

import com.deliberation.dto.cotation.MentionSemestreEcueDTO;
import com.deliberation.dto.cotation.response.MentionSemestreRequestDTO;
import com.deliberation.model.cotation.*;
import com.deliberation.model.inscription.AnneeAcademique;
import com.deliberation.model.inscription.Mention;
import com.deliberation.service.cotation.*;
import com.deliberation.service.inscription.AnneeService;
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
@RequestMapping("/api/mention_semestre_ecues")
public class MentionSemestreEcueController {

    private static final Logger logger =
            LoggerFactory.getLogger(MentionSemestreEcueController.class);

    private final MentionSemestreEcueService service;
    private final MentionSemestreEcueDetailService detailService;

    private final MentionService mentionService;
    private final AnneeService anneeService;
    private final SemestreService semestreService;
    private final CategorieService categorieService;
    private final EcueService ecueService;

    public MentionSemestreEcueController(
            MentionSemestreEcueService service,
            MentionService mentionService,
            AnneeService anneeService,
            SemestreService semestreService,
            MentionSemestreEcueDetailService detailService,
            CategorieService categorieService,
            EcueService ecueService
    ) {
        this.service = service;
        this.mentionService = mentionService;
        this.anneeService = anneeService;
        this.semestreService = semestreService;
        this.detailService = detailService;
        this.categorieService = categorieService;
        this.ecueService = ecueService;
    }

    @GetMapping
    @Operation(
            summary = "Lister les mentions semestre ECUE",
            description = "Retourne la liste complète des mentions semestre ECUE"
    )
    @ApiResponse(responseCode = "200", description = "Liste récupérée avec succès")
    public List<MentionSemestreEcue> all() {

        logger.info(
                "[MentionSemestreEcueController] GET /api/mention_semestre_ecues - Récupération"
        );

        return service.getAll();
    }

    @GetMapping("/{id}")
    @Operation(
            summary = "Obtenir une mention semestre ECUE par ID",
            description = "Retourne une mention semestre ECUE à partir de son identifiant"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Mention trouvée"),
            @ApiResponse(responseCode = "404", description = "Mention introuvable")
    })
    public ResponseEntity<MentionSemestreEcue> get(@PathVariable String id) {

        logger.info("[MentionSemestreEcueController] GET /api/mention_semestre_ecues/{} - Récupération", id);

        return service.get(id)
            .map(mention -> {
                logger.info("[MentionSemestreEcueController] Mention {} trouvée", id);
                return ResponseEntity.ok(mention);
            })
            .orElseGet(() -> {logger.warn("[MentionSemestreEcueController] Mention {} introuvable", id);
                return ResponseEntity.notFound().build();
            });
    }

    @GetMapping("/mention/{mentionId}/semestre/{semestreId}/annee/{anneeId}/session/{sessionId}")
    @Operation(
            summary = "Obtenir une mention semestre ECUE par paramètres",
            description = "Retourne une mention semestre ECUE à partir de la mention, du semestre et de l'année"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Mention trouvée"),
            @ApiResponse(responseCode = "404", description = "Mention introuvable")
    })
    public ResponseEntity<MentionSemestreEcue> getByParams(@PathVariable String mentionId, @PathVariable String semestreId, @PathVariable String anneeId, @PathVariable String sessionId) {

        logger.info("[MentionSemestreEcueController] GET - mentionId={}, semestreId={}, anneeId={}", mentionId, semestreId, anneeId);

        return service.get(mentionId, semestreId, anneeId)
            .map(mention -> {logger.info("[MentionSemestreEcueController] Mention trouvée");
                return ResponseEntity.ok(mention);
            })
            .orElseGet(() -> {
                logger.warn("[MentionSemestreEcueController] Aucune mention trouvée");
                return ResponseEntity.notFound().build();
            });
    }

    @GetMapping(
            "/mention/{mentionId}/semestre/{semestreId}/annee/{anneeId}/session/{sessionId}/details"
    )
    @Operation(
            summary = "Obtenir les détails d'une mention semestre ECUE",
            description = "Retourne les détails liés à une mention semestre ECUE"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Détails trouvés"),
            @ApiResponse(responseCode = "404", description = "Mention introuvable")
    })
    public ResponseEntity<MentionSemestreEcue> getDetails(@PathVariable String mentionId, @PathVariable String semestreId, @PathVariable String anneeId, @PathVariable String sessionId) {

        logger.info("[MentionSemestreEcueController] GET DETAILS - mentionId={}, semestreId={}, anneeId={}",
                mentionId, semestreId, anneeId);

        var mentionSemestreEcue = service.get(mentionId, semestreId, anneeId);

        if (mentionSemestreEcue.isPresent()) {

            logger.info("[MentionSemestreEcueController] Mention semestre ecue trouvée");

            return ResponseEntity.ok(mentionSemestreEcue.get());
        }

        logger.warn("[MentionSemestreEcueController] Aucune Mention semestre ecue trouvée");

        return ResponseEntity.notFound().build();
    }

    @PostMapping
    @Operation(
            summary = "Créer une mention semestre ECUE",
            description = "Crée une nouvelle mention semestre ECUE"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Mention créée"),
            @ApiResponse(responseCode = "400", description = "Requête invalide")
    })
    public ResponseEntity<MentionSemestreEcue> create(
            @RequestBody MentionSemestreEcueDTO dto
    ) {

        logger.info("[MentionSemestreEcueController] POST /api/mention_semestre_ecues - Création");

        var mention = mentionService.get(dto.mentionId)
            .orElseThrow(() ->
                    new IllegalArgumentException("Mention introuvable"));

        var semestre = semestreService.get(dto.semestreId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Semestre introuvable"));

        var annee = anneeService.get(dto.anneeId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Année académique introuvable"));

        var instance = new MentionSemestreEcue();
        instance.fromDTO(dto, mention, semestre, annee);

        var created = service.create(instance);

        logger.info("[MentionSemestreEcueController] Mention créée avec succès - ID={}", created.getId());

        return ResponseEntity.created(URI.create("/api/mention_semestre_ecues/" + created.getId()))
                .body(created);
    }

    @PostMapping("/add_all")
    @Operation(
            summary = "Créer une mention semestre ECUE avec détails",
            description = "Crée une mention semestre ECUE avec tous ses détails"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Mention créée"),
            @ApiResponse(responseCode = "400", description = "Requête invalide")
    })
    public ResponseEntity<MentionSemestreEcue> createAll(@RequestBody MentionSemestreRequestDTO dto) {

        logger.info("[MentionSemestreEcueController] POST /add_all - Création complète");

        var mentionDto = dto.mentionSemestre;

        var mention = mentionService.get(mentionDto.mentionId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Mention introuvable"));

        var semestre = semestreService.get(mentionDto.semestreId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Semestre introuvable"));

        var annee = anneeService.get(mentionDto.anneeId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Année académique introuvable"));

        var instance = new MentionSemestreEcue();
        instance.fromDTO(mentionDto, mention, semestre, annee);

        var details = dto.details
                .stream()
                .map(detailDto -> {

                    var categorie = categorieService
                        .get(detailDto.categorieId)
                        .orElseThrow(() ->
                                new IllegalArgumentException("Catégorie introuvable : " + detailDto.categorieId
                                ));

                    var ecue = ecueService
                            .get(detailDto.ecueId)
                            .orElseThrow(() ->
                                    new IllegalArgumentException("ECUE introuvable : " + detailDto.ecueId));

                    var detail = new MentionSemestreEcueDetail();
                    detail.fromDTO(detailDto, instance, categorie, ecue);

                    return detail;
                })
                .toList();

        instance.setDetails(details);

        var created = service.createAll(instance);

        logger.info("[MentionSemestreEcueController] Création réussie - ID={}", created.getId());

        return ResponseEntity.created(URI.create("/api/mention_semestre_ecues/" + created.getId()
                        )).body(created);
    }

    @PutMapping("/{id}")
    @Operation(
            summary = "Mettre à jour une mention semestre ECUE",
            description = "Met à jour une mention semestre ECUE existante"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Mention mise à jour"),
            @ApiResponse(responseCode = "404", description = "Mention introuvable")
    })
    public ResponseEntity<MentionSemestreEcue> update(
            @PathVariable String id,
            @RequestBody MentionSemestreEcueDTO dto
    ) {

        logger.info(
                "[MentionSemestreEcueController] PUT /api/mention_semestre_ecues/{} - Mise à jour",
                id
        );

        return service.get(id)
                .map(existing -> {

                    if (dto.mentionId != null) {

                        Mention mention = mentionService.get(dto.mentionId)
                                .orElseThrow(() ->
                                        new IllegalArgumentException(
                                                "Mention introuvable"
                                        )
                                );

                        existing.setMention(mention);
                    }

                    if (dto.semestreId != null) {

                        Semestre semestre =
                                semestreService.get(dto.semestreId)
                                        .orElseThrow(() ->
                                                new IllegalArgumentException(
                                                        "Semestre introuvable"
                                                )
                                        );

                        existing.setSemestre(semestre);
                    }

                    if (dto.anneeId != null) {

                        AnneeAcademique annee =
                                anneeService.get(dto.anneeId)
                                        .orElseThrow(() ->
                                                new IllegalArgumentException(
                                                        "Année académique introuvable"
                                                )
                                        );

                        existing.setAnnee(annee);
                    }

                    existing.fromDTO(dto, null, null, null);

                    MentionSemestreEcue updated =
                            service.update(id, existing);

                    logger.info(
                            "[MentionSemestreEcueController] Mention {} mise à jour avec succès",
                            id
                    );

                    return ResponseEntity.ok(updated);
                })
                .orElseGet(() -> {

                    logger.warn(
                            "[MentionSemestreEcueController] Mention {} introuvable",
                            id
                    );

                    return ResponseEntity.notFound().build();
                });
    }

    @DeleteMapping("/{id}")
    @Operation(
            summary = "Supprimer une mention semestre ECUE",
            description = "Supprime une mention semestre ECUE"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Mention supprimée"),
            @ApiResponse(responseCode = "404", description = "Mention introuvable")
    })
    public ResponseEntity<Void> delete(
            @PathVariable String id
    ) {

        logger.info(
                "[MentionSemestreEcueController] DELETE /api/mention_semestre_ecues/{} - Suppression",
                id
        );

        if (service.get(id).isEmpty()) {

            logger.warn(
                    "[MentionSemestreEcueController] Mention {} introuvable",
                    id
            );

            return ResponseEntity.notFound().build();
        }

        service.delete(id);

        logger.info(
                "[MentionSemestreEcueController] Mention {} supprimée avec succès",
                id
        );

        return ResponseEntity.noContent().build();
    }
}