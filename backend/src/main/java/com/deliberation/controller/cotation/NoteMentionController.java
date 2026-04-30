package com.deliberation.controller.cotation;

import com.deliberation.dto.cotation.NoteMentionDTO;
import com.deliberation.model.cotation.NoteMention;
import com.deliberation.model.cotation.Semestre;
import com.deliberation.model.cotation.Session;
import com.deliberation.model.inscription.AnneeAcademique;
import com.deliberation.model.inscription.Mention;
import com.deliberation.service.cotation.NoteMentionService;
import com.deliberation.service.cotation.SemestreService;
import com.deliberation.service.cotation.SessionService;
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
@RequestMapping("/api/note_mentions")
public class NoteMentionController {

    private final NoteMentionService service;
    private final MentionService mentionService;
    private final AnneeService anneeService;
    private final SemestreService semestreService;
    private final SessionService sessionService;

    private static final Logger logger = LoggerFactory.getLogger(NoteMentionController.class);

    public NoteMentionController(
            NoteMentionService service,
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
            summary = "Lister les notes par mention",
            description = "Retourne la liste complète des notes par mention"
    )
    @ApiResponse(responseCode = "200", description = "Liste récupérée avec succès")
    public List<NoteMention> all() {
        logger.info("[NoteMentionController] GET /api/note_mentions - Récupération");
        return service.getAll();
    }

    @GetMapping("/{id}")
    @Operation(
            summary = "Obtenir une note mention par ID",
            description = "Retourne une note mention à partir de son identifiant"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Note trouvée"),
            @ApiResponse(responseCode = "404", description = "Note introuvable")
    })
    public ResponseEntity<NoteMention> get(@PathVariable String id) {

        logger.info("[NoteMentionController] GET /api/note_mentions/{} - Récupération", id);

        return service.get(id)
                .map(note -> {
                    logger.info("[NoteMentionController] Note {} trouvée", id);
                    return ResponseEntity.ok(note);
                })
                .orElseGet(() -> {
                    logger.warn("[NoteMentionController] Note {} introuvable", id);
                    return ResponseEntity.notFound().build();
                });
    }

    @PostMapping
    @Operation(
            summary = "Créer une note mention",
            description = "Crée une nouvelle note liée à une mention, semestre, année et session"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Note créée"),
            @ApiResponse(responseCode = "400", description = "Requête invalide")
    })
    public ResponseEntity<NoteMention> create(@RequestBody NoteMentionDTO dto) {

        logger.info("[NoteMentionController] POST /api/note_mentions - Création");

        Mention mention = mentionService.get(dto.mentionId)
                .orElseThrow(() -> new IllegalArgumentException("Mention introuvable"));

        Semestre semestre = semestreService.get(dto.semestreId)
                .orElseThrow(() -> new IllegalArgumentException("Semestre introuvable"));

        AnneeAcademique annee = anneeService.get(dto.anneeId)
                .orElseThrow(() -> new IllegalArgumentException("Année académique introuvable"));

        Session session = sessionService.get(dto.sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Session introuvable"));

        NoteMention instance = new NoteMention();
        instance.fromDTO(dto, mention, semestre, annee, session);

        NoteMention created = service.create(instance);

        logger.info("[NoteMentionController] Note créée avec succès - ID: {}", created.getId());

        return ResponseEntity
                .created(URI.create("/api/note_mentions/" + created.getId()))
                .body(created);
    }

    @PutMapping("/{id}")
    @Operation(
            summary = "Mettre à jour une note mention",
            description = "Met à jour une note existante"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Note mise à jour"),
            @ApiResponse(responseCode = "404", description = "Note introuvable")
    })
    public ResponseEntity<NoteMention> update(
            @PathVariable String id,
            @RequestBody NoteMentionDTO dto
    ) {

        logger.info("[NoteMentionController] PUT /api/note_mentions/{} - Mise à jour", id);

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

                    NoteMention updated = service.update(id, existing);

                    logger.info("[NoteMentionController] Note {} mise à jour avec succès", id);

                    return ResponseEntity.ok(updated);
                })
                .orElseGet(() -> {
                    logger.warn("[NoteMentionController] Note {} introuvable", id);
                    return ResponseEntity.notFound().build();
                });
    }

    @DeleteMapping("/{id}")
    @Operation(
            summary = "Supprimer une note mention",
            description = "Supprime une note"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Note supprimée"),
            @ApiResponse(responseCode = "404", description = "Note introuvable")
    })
    public ResponseEntity<Void> delete(@PathVariable String id) {

        logger.info("[NoteMentionController] DELETE /api/note_mentions/{} - Suppression", id);

        if (service.get(id).isEmpty()) {
            logger.warn("[NoteMentionController] Note {} introuvable", id);
            return ResponseEntity.notFound().build();
        }

        service.delete(id);

        logger.info("[NoteMentionController] Note {} supprimée avec succès", id);

        return ResponseEntity.noContent().build();
    }
}