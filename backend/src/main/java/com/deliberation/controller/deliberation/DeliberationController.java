package com.deliberation.controller.deliberation;

import com.deliberation.dto.cotation.response.CotationRequestDTO;
import com.deliberation.dto.deliberation.DeliberationDTO;
import com.deliberation.dto.deliberation.response.DeliberationRequestDTO;
import com.deliberation.model.cotation.*;
import com.deliberation.model.deliberation.Deliberation;
import com.deliberation.model.deliberation.DeliberationDetail;
import com.deliberation.model.inscription.AnneeAcademique;
import com.deliberation.model.inscription.Inscription;
import com.deliberation.model.inscription.Mention;
import com.deliberation.service.cotation.MentionSemestreEcueDetailService;
import com.deliberation.service.deliberation.DeliberationService;
import com.deliberation.service.inscription.AnneeService;
import com.deliberation.service.inscription.InscriptionService;
import com.deliberation.service.inscription.MentionService;
import com.deliberation.service.cotation.SemestreService;
import com.deliberation.service.cotation.SessionService;
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
@RequestMapping("/api/deliberations")
public class DeliberationController {

    private final DeliberationService service;
    private final MentionService mentionService;
    private final AnneeService anneeService;
    private final SemestreService semestreService;
    private final SessionService sessionService;
    private final InscriptionService inscriptionService;
    private final MentionSemestreEcueDetailService mentionSemestreEcueDetailService;

    private static final Logger logger = LoggerFactory.getLogger(DeliberationController.class);

    public DeliberationController(
            DeliberationService service,
            MentionService mentionService,
            AnneeService anneeService,
            SemestreService semestreService,
            SessionService sessionService, InscriptionService inscriptionService, MentionSemestreEcueDetailService mentionSemestreEcueDetailService
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
            summary = "Lister les délibérations par mention",
            description = "Retourne la liste complète des délibérations"
    )
    @ApiResponse(responseCode = "200", description = "Liste récupérée avec succès")
    public List<Deliberation> all() {
        logger.info("[DeliberationMentionController] GET /api/deliberations - Récupération");
        return service.getAll();
    }

    @GetMapping("/{id}")
    @Operation(
            summary = "Obtenir une délibération par ID",
            description = "Retourne une délibération à partir de son identifiant"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Délibération trouvée"),
            @ApiResponse(responseCode = "404", description = "Délibération introuvable")
    })
    public ResponseEntity<Deliberation> get(@PathVariable String id) {

        logger.info("[DeliberationMentionController] GET /api/deliberations/{} - Récupération", id);

        return service.get(id)
                .map(delib -> {
                    logger.info("[DeliberationMentionController] Délibération {} trouvée", id);
                    return ResponseEntity.ok(delib);
                })
                .orElseGet(() -> {
                    logger.warn("[DeliberationMentionController] Délibération {} introuvable", id);
                    return ResponseEntity.notFound().build();
                });
    }

    @PostMapping
    @Operation(
            summary = "Créer une délibération",
            description = "Crée une nouvelle délibération liée à une mention, semestre, année et session"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Délibération créée"),
            @ApiResponse(responseCode = "400", description = "Requête invalide")
    })
    public ResponseEntity<Deliberation> create(@RequestBody DeliberationDTO dto) {

        logger.info("[DeliberationMentionController] POST /api/deliberations - Création");

        Mention mention = mentionService.get(dto.mentionId)
                .orElseThrow(() -> new IllegalArgumentException("Mention introuvable"));

        Semestre semestre = semestreService.get(dto.semestreId)
                .orElseThrow(() -> new IllegalArgumentException("Semestre introuvable"));

        AnneeAcademique annee = anneeService.get(dto.anneeId)
                .orElseThrow(() -> new IllegalArgumentException("Année académique introuvable"));

        Session session = sessionService.get(dto.sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Session introuvable"));

        Deliberation instance = new Deliberation();
        instance.fromDTO(dto, mention, semestre, annee, session);

        Deliberation created = service.create(instance);

        logger.info("[DeliberationMentionController] Délibération créée avec succès - ID: {}", created.getId());

        return ResponseEntity
                .created(URI.create("/api/deliberations/" + created.getId()))
                .body(created);
    }

    @PostMapping("/add_all")
    public ResponseEntity<Deliberation> createAll(@RequestBody DeliberationRequestDTO dto) {

        logger.info("[DeliberationController] Création cotation mention");

        Mention mention = mentionService.get(dto.deliberation.mentionId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Mention introuvable"));

        Semestre semestre = semestreService.get(dto.deliberation.semestreId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Semestre introuvable"));

        AnneeAcademique annee = anneeService.get(dto.deliberation.anneeId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Année académique introuvable"));

        Session session = sessionService.get(dto.deliberation.sessionId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Session introuvable"));

        Deliberation instance = new Deliberation();
        instance.fromDTO(dto.deliberation, mention, semestre, annee, session);

        var details = dto.details.stream()
                .map(d -> {

                    Inscription inscription = inscriptionService
                            .get(d.inscriptionId)
                            .orElseThrow(() -> new IllegalArgumentException(
                                    "Inscription introuvable : " + d.inscriptionId));

                    DeliberationDetail detail = new DeliberationDetail();

                    detail.fromDTO(d, instance, inscription);

                    return detail;
                })
                .toList();

        instance.setDetails(details);

        Deliberation created = service.createAll(instance);

        logger.info(
                "[DeliberationController] cotation créée avec succès - ID={}",
                created.getId()
        );

        return ResponseEntity
                .created(URI.create("/api/deliberations/add_all" + created.getId()))
                .body(created);
    }

    @PutMapping("/{id}")
    @Operation(
            summary = "Mettre à jour une délibération",
            description = "Met à jour une délibération existante"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Délibération mise à jour"),
            @ApiResponse(responseCode = "404", description = "Délibération introuvable")
    })
    public ResponseEntity<Deliberation> update(
            @PathVariable String id,
            @RequestBody DeliberationDTO dto
    ) {

        logger.info("[DeliberationMentionController] PUT /api/deliberations/{} - Mise à jour", id);

        return service.get(id)
                .map(existing -> {

                    Mention mention = null;
                    if (dto.mentionId != null) {
                        mention = mentionService.get(dto.mentionId)
                                .orElseThrow(() -> new IllegalArgumentException("Mention introuvable"));
                        existing.setMention(mention);
                    }

                    Semestre semestre = null;
                    if (dto.semestreId != null) {
                        semestre = semestreService.get(dto.semestreId)
                                .orElseThrow(() -> new IllegalArgumentException("Semestre introuvable"));
                        existing.setSemestre(semestre);
                    }

                    AnneeAcademique annee = null;
                    if (dto.anneeId != null) {
                        annee = anneeService.get(dto.anneeId)
                                .orElseThrow(() -> new IllegalArgumentException("Année académique introuvable"));
                        existing.setAnnee(annee);
                    }

                    Session session = null;
                    if (dto.sessionId != null) {
                        session = sessionService.get(dto.sessionId)
                                .orElseThrow(() -> new IllegalArgumentException("Session introuvable"));
                        existing.setSession(session);
                    }

                    existing.fromDTO(dto, mention, semestre, annee, session);

                    Deliberation updated = service.update(id, existing);

                    logger.info("[DeliberationMentionController] Délibération {} mise à jour avec succès", id);

                    return ResponseEntity.ok(updated);
                })
                .orElseGet(() -> {
                    logger.warn("[DeliberationMentionController] Délibération {} introuvable", id);
                    return ResponseEntity.notFound().build();
                });
    }

    @DeleteMapping("/{id}")
    @Operation(
            summary = "Supprimer une délibération",
            description = "Supprime une délibération"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Délibération supprimée"),
            @ApiResponse(responseCode = "404", description = "Délibération introuvable")
    })
    public ResponseEntity<Void> delete(@PathVariable String id) {

        logger.info("[DeliberationMentionController] DELETE /api/deliberations/{} - Suppression", id);

        if (service.get(id).isEmpty()) {
            logger.warn("[DeliberationMentionController] Délibération {} introuvable", id);
            return ResponseEntity.notFound().build();
        }

        service.delete(id);

        logger.info("[DeliberationMentionController] Délibération {} supprimée avec succès", id);

        return ResponseEntity.noContent().build();
    }
}