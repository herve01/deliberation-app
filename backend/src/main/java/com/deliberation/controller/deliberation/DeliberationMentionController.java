package com.deliberation.controller.deliberation;

import com.deliberation.dto.deliberation.DeliberationMentionDTO;
import com.deliberation.model.deliberation.DeliberationMention;
import com.deliberation.model.cotation.Semestre;
import com.deliberation.model.cotation.Session;
import com.deliberation.model.inscription.AnneeAcademique;
import com.deliberation.model.inscription.Mention;
import com.deliberation.service.deliberation.DeliberationMentionService;
import com.deliberation.service.inscription.AnneeService;
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
@RequestMapping("/api/deliberation_mentions")
public class DeliberationMentionController {

    private final DeliberationMentionService service;
    private final MentionService mentionService;
    private final AnneeService anneeService;
    private final SemestreService semestreService;
    private final SessionService sessionService;

    private static final Logger logger = LoggerFactory.getLogger(DeliberationMentionController.class);

    public DeliberationMentionController(
            DeliberationMentionService service,
            MentionService mentionService,
            AnneeService anneeService,
            SemestreService semestreService,
            SessionService sessionService
    ) {
        this.service = service;
        this.mentionService = mentionService;
        this.anneeService = anneeService;
        this.semestreService = semestreService;
        this.sessionService = sessionService;
    }

    @GetMapping
    @Operation(
            summary = "Lister les délibérations par mention",
            description = "Retourne la liste complète des délibérations"
    )
    @ApiResponse(responseCode = "200", description = "Liste récupérée avec succès")
    public List<DeliberationMention> all() {
        logger.info("[DeliberationMentionController] GET /api/deliberation_mentions - Récupération");
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
    public ResponseEntity<DeliberationMention> get(@PathVariable String id) {

        logger.info("[DeliberationMentionController] GET /api/deliberation_mentions/{} - Récupération", id);

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
    public ResponseEntity<DeliberationMention> create(@RequestBody DeliberationMentionDTO dto) {

        logger.info("[DeliberationMentionController] POST /api/deliberation_mentions - Création");

        Mention mention = mentionService.get(dto.mentionId)
                .orElseThrow(() -> new IllegalArgumentException("Mention introuvable"));

        Semestre semestre = semestreService.get(dto.semestreId)
                .orElseThrow(() -> new IllegalArgumentException("Semestre introuvable"));

        AnneeAcademique annee = anneeService.get(dto.anneeId)
                .orElseThrow(() -> new IllegalArgumentException("Année académique introuvable"));

        Session session = sessionService.get(dto.sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Session introuvable"));

        DeliberationMention instance = new DeliberationMention();
        instance.fromDTO(dto, mention, semestre, annee, session);

        DeliberationMention created = service.create(instance);

        logger.info("[DeliberationMentionController] Délibération créée avec succès - ID: {}", created.getId());

        return ResponseEntity
                .created(URI.create("/api/deliberation_mentions/" + created.getId()))
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
    public ResponseEntity<DeliberationMention> update(
            @PathVariable String id,
            @RequestBody DeliberationMentionDTO dto
    ) {

        logger.info("[DeliberationMentionController] PUT /api/deliberation_mentions/{} - Mise à jour", id);

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

                    DeliberationMention updated = service.update(id, existing);

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

        logger.info("[DeliberationMentionController] DELETE /api/deliberation_mentions/{} - Suppression", id);

        if (service.get(id).isEmpty()) {
            logger.warn("[DeliberationMentionController] Délibération {} introuvable", id);
            return ResponseEntity.notFound().build();
        }

        service.delete(id);

        logger.info("[DeliberationMentionController] Délibération {} supprimée avec succès", id);

        return ResponseEntity.noContent().build();
    }
}