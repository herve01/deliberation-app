package com.deliberation.controller.cotation;

import com.deliberation.dto.cotation.CotationDTO;
import com.deliberation.dto.cotation.response.CotationRequestDTO;
import com.deliberation.model.cotation.*;
import com.deliberation.model.inscription.AnneeAcademique;
import com.deliberation.model.inscription.Inscription;
import com.deliberation.model.inscription.Mention;
import com.deliberation.service.cotation.MentionSemestreEcueDetailService;
import com.deliberation.service.cotation.CotationService;
import com.deliberation.service.cotation.SemestreService;
import com.deliberation.service.cotation.SessionService;
import com.deliberation.service.inscription.AnneeService;
import com.deliberation.service.inscription.InscriptionService;
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
@RequestMapping("/api/cotations")
public class CotationController {

    private final CotationService service;
    private final MentionService mentionService;
    private final AnneeService anneeService;
    private final SemestreService semestreService;
    private final SessionService sessionService;
    private final InscriptionService inscriptionService;
    private final MentionSemestreEcueDetailService mentionSemestreEcueDetailService;

    private static final Logger logger = LoggerFactory.getLogger(CotationController.class);

    public CotationController(
            CotationService service,
            MentionService mentionService,
            AnneeService anneeService,
            SemestreService semestreService,
            SessionService sessionService,
            InscriptionService inscriptionService,
            MentionSemestreEcueDetailService mentionSemestreEcueDetailService
    ) {
        this.service = service;
        this.mentionService = mentionService;
        this.anneeService = anneeService;
        this.semestreService = semestreService;
        this.sessionService = sessionService;
        this.inscriptionService = inscriptionService;
        this.mentionSemestreEcueDetailService = mentionSemestreEcueDetailService;
    }

    @GetMapping
    @Operation(
            summary = "Lister les cotations par mention",
            description = "Retourne la liste complète des cotations par mention"
    )
    @ApiResponse(responseCode = "200", description = "Liste récupérée avec succès")
    public List<Cotation> all() {

        logger.info("[CotationController] GET /api/Cotation_mentions - Récupération des cotations");

        return service.getAll();
    }

    @GetMapping("/{id}")
    @Operation(
            summary = "Obtenir une cotation mention par ID",
            description = "Retourne une cotation mention à partir de son identifiant"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "cotation trouvée"),
            @ApiResponse(responseCode = "404", description = "cotation introuvable")
    })
    public ResponseEntity<Cotation> get(@PathVariable String id) {

        logger.info("[CotationController] GET /api/Cotation_mentions/{} - Récupération", id);

        return service.get(id)
            .map(cotation -> {
                logger.info("[CotationController] cotation {} trouvée", id);
                return ResponseEntity.ok(cotation);
            })
            .orElseGet(() -> {
                logger.warn("[CotationController] cotation {} introuvable", id);
                return ResponseEntity.notFound().build();
            });
    }

    @GetMapping("/mention/{mentionId}/semestre/{semestreId}/annee/{anneeId}/session/{sessionId}")
    @Operation(
            summary = "Obtenir une cotation mention par paramètres",
            description = "Retourne une cotation mention à partir de la mention, du semestre, de l'année et de la session"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Cotation trouvée"),
            @ApiResponse(responseCode = "404", description = "Cotation introuvable")
    })
    public ResponseEntity<Cotation> get(@PathVariable String mentionId, @PathVariable String semestreId, @PathVariable String anneeId, @PathVariable String sessionId
    ) {

        logger.info(
                "[CotationController] GET cotation mention - mentionId={}, semestreId={}, anneeId={}, sessionId={}",
                mentionId, semestreId, anneeId, sessionId);

        var cotation = service.get(anneeId, mentionId, semestreId, sessionId);

        if (cotation.isPresent()) {

            logger.info("[CotationController] Cotation trouvée");

            return ResponseEntity.ok(cotation.get());
        }

        logger.warn("[CotationController] Aucune cotation trouvée");

        return ResponseEntity.notFound().build();
    }

    @GetMapping("/mention/{mentionId}/semestre/{semestreId}/annee/{anneeId}/session/{sessionId}/mentionSemestreEcue/{mentionSemestreEcueId}")
    @Operation(
            summary = "Obtenir une cotation mention par paramètres",
            description = "Retourne une cotation mention à partir de la mention, du semestre, de l'année, de la session et du mentionEcue"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Cotation trouvée"),
            @ApiResponse(responseCode = "404", description = "Cotation introuvable")
    })
    public ResponseEntity<Cotation> get(@PathVariable String mentionId, @PathVariable String semestreId,
                                        @PathVariable String anneeId, @PathVariable String sessionId, @PathVariable String mentionSemestreEcueId
    ) {

        logger.info(
                "[CotationController] GET cotation mention - mentionId={}, semestreId={}, anneeId={}, sessionId={}, mentionEcueId={}", mentionId, semestreId,
                anneeId, sessionId, mentionSemestreEcueId);

        var cotation = service.get(mentionId, semestreId, anneeId, sessionId, mentionSemestreEcueId);

        if (cotation.isPresent()) {

            logger.info("[CotationController] Cotation trouvée");

            return ResponseEntity.ok(cotation.get());
        }

        logger.warn("[CotationController] Aucune cotation trouvée");

        return ResponseEntity.notFound().build();
    }

    @PostMapping
    @Operation(
            summary = "Créer une cotation mention",
            description = "Crée une nouvelle cotation liée à une mention, semestre, année et session"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "cotation créée"),
            @ApiResponse(responseCode = "400", description = "Requête invalide")
    })
    public ResponseEntity<Cotation> create(@RequestBody CotationDTO dto) {

        logger.info("[CotationController] POST /api/Cotation_mentions - Création");

        Mention mention = mentionService.get(dto.mentionId)
                .orElseThrow(() -> new IllegalArgumentException("Mention introuvable"));

        Semestre semestre = semestreService.get(dto.semestreId)
                .orElseThrow(() -> new IllegalArgumentException("Semestre introuvable"));

        AnneeAcademique annee = anneeService.get(dto.anneeId)
                .orElseThrow(() -> new IllegalArgumentException("Année académique introuvable"));

        Session session = sessionService.get(dto.sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Session introuvable"));

        Cotation instance = new Cotation();
        instance.fromDTO(dto, mention, semestre, annee, session);

        Cotation created = service.create(instance);

        logger.info("[CotationController] cotation créée avec succès - ID={}", created.getId());

        return ResponseEntity
                .created(URI.create("/api/Cotation_mentions/" + created.getId()))
                .body(created);
    }

    @PostMapping("/add_all")
    public ResponseEntity<Cotation> createAll(@RequestBody CotationRequestDTO dto) {

        logger.info("[CotationController] Création cotation mention");

        Mention mention = mentionService.get(dto.cotation.mentionId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Mention introuvable"));

        Semestre semestre = semestreService.get(dto.cotation.semestreId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Semestre introuvable"));

        AnneeAcademique annee = anneeService.get(dto.cotation.anneeId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Année académique introuvable"));

        Session session = sessionService.get(dto.cotation.sessionId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Session introuvable"));

        Cotation instance = new Cotation();
        instance.fromDTO(dto.cotation, mention, semestre, annee, session);

        var details = dto.details.stream()
                .map(d -> {

                    Inscription inscription = inscriptionService
                            .get(d.inscriptionId)
                            .orElseThrow(() -> new IllegalArgumentException(
                                            "Inscription introuvable : " + d.inscriptionId));

                    MentionSemestreEcueDetail mentionEcue = mentionSemestreEcueDetailService
                            .get(d.mentionSemestreEcueId)
                            .orElseThrow(() -> new IllegalArgumentException(
                                            "ECUE introuvable : " + d.mentionSemestreEcueId));

                    CotationDetail detail = new CotationDetail();

                    detail.fromDTO(d, instance, inscription, mentionEcue);

                    return detail;
                })
                .toList();

        instance.setDetails(details);

        Cotation created = service.createAll(instance);

        logger.info(
                "[CotationController] cotation créée avec succès - ID={}",
                created.getId()
        );

        return ResponseEntity
                .created(URI.create("/api/Cotation_mentions/add_all" + created.getId()))
                .body(created);
    }

    @PutMapping("/{id}")
    @Operation(
            summary = "Mettre à jour une cotation mention",
            description = "Met à jour une cotation existante"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "cotation mise à jour"),
            @ApiResponse(responseCode = "404", description = "cotation introuvable")
    })
    public ResponseEntity<Cotation> update(
            @PathVariable String id,
            @RequestBody CotationDTO dto
    ) {
        logger.info("[CotationController] PUT /api/Cotation_mentions/{} - Mise à jour", id);

        return service.get(id)
                .map(existing -> {
                    if (dto.mentionId != null) {
                        Mention mention = mentionService.get(dto.mentionId)
                                .orElseThrow(() -> new IllegalArgumentException("Mention introuvable"));
                        existing.setMention(mention);
                    }

                    if (dto.semestreId != null) {
                        Semestre semestre = semestreService.get(dto.semestreId)
                                .orElseThrow(() -> new IllegalArgumentException("Semestre introuvable"));
                        existing.setSemestre(semestre);
                    }

                    if (dto.anneeId != null) {
                        AnneeAcademique annee = anneeService.get(dto.anneeId)
                                .orElseThrow(() -> new IllegalArgumentException("Année académique introuvable"));
                        existing.setAnnee(annee);
                    }

                    if (dto.sessionId != null) {
                        Session session = sessionService.get(dto.sessionId)
                                .orElseThrow(() -> new IllegalArgumentException("Session introuvable"));
                        existing.setSession(session);
                    }

                    existing.fromDTO(dto, null, null, null, null);
                    Cotation updated = service.update(id, existing);

                    logger.info("[CotationController] cotation {} mise à jour avec succès", id);

                    return ResponseEntity.ok(updated);
                })
                .orElseGet(() -> {
                    logger.warn("[CotationController] cotation {} introuvable", id);
                    return ResponseEntity.notFound().build();
                });
    }

    @DeleteMapping("/{id}")
    @Operation(
            summary = "Supprimer une cotation mention",
            description = "Supprime une cotation mention"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "cotation supprimée"),
            @ApiResponse(responseCode = "404", description = "cotation introuvable")
    })
    public ResponseEntity<Void> delete(@PathVariable String id) {
        logger.info("[CotationController] DELETE /api/Cotation_mentions/{} - Suppression", id);

        if (service.get(id).isEmpty()) {
            logger.warn("[CotationController] cotation {} introuvable", id);
            return ResponseEntity.notFound().build();
        }

        service.delete(id);
        logger.info("[CotationController] cotation {} supprimée avec succès", id);

        return ResponseEntity.noContent().build();
    }
}