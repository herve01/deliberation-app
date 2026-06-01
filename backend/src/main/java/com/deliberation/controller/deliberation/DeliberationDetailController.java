package com.deliberation.controller.deliberation;

import com.deliberation.dto.deliberation.DeliberationDetailDTO;
import com.deliberation.model.deliberation.Deliberation;
import com.deliberation.model.deliberation.DeliberationDetail;
import com.deliberation.model.deliberation.pojo.DeliberationPojo;
import com.deliberation.model.deliberation.pojo.DeliberationMentionPojo;
import com.deliberation.model.inscription.Inscription;
import com.deliberation.service.cotation.*;
import com.deliberation.service.deliberation.DeliberationDetailService;
import com.deliberation.service.deliberation.DeliberationService;
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
import java.util.Optional;

@RestController
@RequestMapping("/api/deliberation_details")
public class DeliberationDetailController {

    private final DeliberationDetailService service;
    private final DeliberationService deliberationService;
    private final InscriptionService inscriptionService;
    private final MentionSemestreEcueDetailService mentionSemestreEcueDetailService;
    private final MentionSemestreEcueService mentionSemestreEcueService;

    private final CotationService cotationService;
    private final CotationDetailService cotationDetailService;

    private final SessionService sessionService;

    private static final Logger logger = LoggerFactory.getLogger(DeliberationDetailController.class);

    public DeliberationDetailController(
            DeliberationDetailService service, DeliberationService deliberationService,
            InscriptionService inscriptionService, MentionSemestreEcueDetailService mentionSemestreEcueDetailService, MentionSemestreEcueService mentionSemestreEcueService, CotationService cotationService, CotationDetailService cotationDetailService, SessionService sessionService
    ) {
        this.service = service;
        this.deliberationService = deliberationService;
        this.inscriptionService = inscriptionService;
        this.mentionSemestreEcueDetailService = mentionSemestreEcueDetailService;
        this.mentionSemestreEcueService = mentionSemestreEcueService;
        this.cotationService = cotationService;
        this.cotationDetailService = cotationDetailService;
        this.sessionService = sessionService;
    }

    @GetMapping
    @Operation(
            summary = "Lister les détails de délibération",
            description = "Retourne la liste complète des détails de délibération"
    )
    @ApiResponse(responseCode = "200", description = "Liste récupérée avec succès")
    public List<DeliberationDetail> all() {
        logger.info("[DeliberationMentionDetailController] GET /api/deliberation_details - Récupération");
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
    public ResponseEntity<DeliberationDetail> get(@PathVariable String id) {

        logger.info("[DeliberationMentionDetailController] GET /api/deliberation_details/{} - Récupération", id);

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
    public ResponseEntity<DeliberationDetail> create(@RequestBody DeliberationDetailDTO dto) {

        logger.info("[DeliberationMentionDetailController] POST /api/deliberation_details - Création");

        Deliberation deliberation = deliberationService.get(dto.deliberationId)
                .orElseThrow(() -> new IllegalArgumentException("Déliberation mention introuvable"));

        Inscription inscription = inscriptionService.get(dto.inscriptionId)
                .orElseThrow(() -> new IllegalArgumentException("Inscription introuvable"));


        DeliberationDetail instance = new DeliberationDetail();
        instance.fromDTO(dto, deliberation, inscription);

        DeliberationDetail created = service.create(instance);

        logger.info("[DeliberationMentionDetailController] Détail créé avec succès - ID: {}", created.getId());

        return ResponseEntity
                .created(URI.create("/api/deliberation_details/" + created.getId()))
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
    public ResponseEntity<DeliberationDetail> update(
            @PathVariable String id,
            @RequestBody DeliberationDetailDTO dto
    ) {

        logger.info("[DeliberationMentionDetailController] PUT /api/deliberation_details/{} - Mise à jour", id);

        return service.get(id)
                .map(existing -> {

                    Deliberation deliberation = null;
                    if (dto.deliberationId != null) {
                        deliberation = deliberationService.get(dto.deliberationId)
                                .orElseThrow(() -> new IllegalArgumentException("Deliberation mention introuvable"));
                        existing.setDeliberation(deliberation);
                    }

                    Inscription inscription = null;
                    if (dto.inscriptionId != null) {
                        inscription = inscriptionService.get(dto.inscriptionId)
                                .orElseThrow(() -> new IllegalArgumentException("Inscription introuvable"));
                        existing.setInscription(inscription);
                    }

                    existing.fromDTO(dto, deliberation, inscription);

                    DeliberationDetail updated = service.update(id, existing);

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

        logger.info("[DeliberationMentionDetailController] DELETE /api/deliberation_details/{} - Suppression", id);

        if (service.get(id).isEmpty()) {
            logger.warn("[DeliberationMentionDetailController] Détail {} introuvable", id);
            return ResponseEntity.notFound().build();
        }

        service.delete(id);

        logger.info("[DeliberationMentionDetailController] Détail {} supprimé avec succès", id);

        return ResponseEntity.noContent().build();
    }


    @GetMapping("/annee/{anneeId}/mention/{mentionId}/semestre/{semestreId}/session/{sessionId}/deliberation")
    @Operation(summary = "Lister les inscriptions d'un étudiant par année")
    public List<DeliberationPojo> getAllByAneeMentionSemestreSession(
            @PathVariable String anneeId, @PathVariable String mentionId,
            @PathVariable String semestreId, @PathVariable String sessionId
    ) {

        logger.info("[DeliberationDetailController] GET /api/deliberation_details/annee/{}/mention/{}/semestre/{}/session/{}",
                anneeId, mentionId, semestreId, sessionId);

        logger.info(
                "[DeliberationDetailController] GET /api/deliberation_details/annee/{}/mention/{}/semestre/{}/session/{}",
                anneeId, mentionId, semestreId, sessionId
        );

        var mentionSemestre = mentionSemestreEcueService.get(mentionId, semestreId, anneeId);

        Float credits = Optional.ofNullable(mentionSemestreEcueDetailService.sum(mentionSemestre.get().getId())).orElse(0F);

        return inscriptionService.getAllBy(anneeId, mentionId)
                .stream()
                .map(inscription -> {
                    var d = new DeliberationPojo();
                    d.setInscription(inscription);
                    d.setCredits(credits);
                    d.setValides(0F);
                    d.setTransferts(0F);
                    d.setMoyenne(0F);
                    d.setDecision("");
                    return d;
                })
                .toList();
    }

    @GetMapping("/annee/{anneeId}/mention/{mentionId}/semestre/{semestreId}/session/{sessionId}/traitement")
    @Operation(summary = "Lister les inscriptions d'un étudiant par année")
    public List<DeliberationMentionPojo> getAllTTByAneeMentionSemestreSession(
            @PathVariable String anneeId, @PathVariable String mentionId, @PathVariable String semestreId, @PathVariable String sessionId) {

        logger.info(
                "[DeliberationDetailController] GET /api/deliberation_details/annee/{}/mention/{}/semestre/{}/session/{}/traitement",
                anneeId, mentionId, semestreId, sessionId
        );

        var mentionSemestre = mentionSemestreEcueService.getOne(mentionId, semestreId, anneeId);
        var cotation = cotationService.get(anneeId, mentionId, semestreId, sessionId);
        var sessionAnnuel = sessionService.getSessionAnnuel(semestreId);

        logger.info(
                "[DeliberationDetailController] cotation : {} | sessionAnnuel : {}",
                cotation,
                sessionAnnuel);

        if (mentionSemestre.isEmpty() || cotation.isEmpty()) {
            return List.of();
        }

        var cotationAnnuel = cotationService.get(anneeId, mentionId, semestreId, sessionAnnuel.get().getId());

        Float credits = Optional.ofNullable(
                mentionSemestreEcueDetailService.sum(mentionSemestre.get().getId())
        ).orElse(0F);


        return inscriptionService.getAllBy(anneeId, mentionId)
                .stream()
                .map(inscription -> {

                    var d = new DeliberationMentionPojo();

                    d.setInscription(inscription);
                    d.setCredits(credits);
                    d.setValides(0F);
                    d.setMoyenne(0F);
                    d.setDecision("");

                    var annuels = cotationAnnuel
                        .map(c -> cotationDetailService.getAllByCotationInscription(
                                c.getId(), inscription.getId()
                        ))
                        .orElse(List.of());

                   var examens = cotationDetailService.getAllByCotationInscription(
                            cotation.get().getId(), inscription.getId());

                    var details = mentionSemestreEcueDetailService.getAll(mentionSemestre.get().getId());

                    d.setMentionSemestreEcueDetails(details);
                    d.setAnnuels(annuels);
                    d.setExamens(examens);

                    return d;
                })
                .toList();
    }
}