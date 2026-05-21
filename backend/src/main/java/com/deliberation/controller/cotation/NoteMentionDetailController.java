package com.deliberation.controller.cotation;

import com.deliberation.dto.cotation.NoteMentionDetailDTO;
import com.deliberation.model.cotation.MentionEcueDetail;
import com.deliberation.model.cotation.NoteMention;
import com.deliberation.model.cotation.NoteMentionDetail;
import com.deliberation.model.inscription.Inscription;
import com.deliberation.service.cotation.MentionEcueDetailService;
import com.deliberation.service.cotation.NoteMentionDetailService;
import com.deliberation.service.cotation.NoteMentionService;
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
@RequestMapping("/api/note_mention_details")
public class NoteMentionDetailController {

    private final NoteMentionDetailService service;
    private final NoteMentionService noteService;
    private final InscriptionService inscriptionService;
    private final MentionEcueDetailService ecueService;

    private static final Logger logger = LoggerFactory.getLogger(NoteMentionDetailController.class);

    public NoteMentionDetailController(
            NoteMentionDetailService service, NoteMentionService noteService,
            InscriptionService inscriptionService,
            MentionEcueDetailService ecueService
    ) {
        this.service = service;
        this.noteService = noteService;
        this.inscriptionService = inscriptionService;
        this.ecueService = ecueService;
    }

    @GetMapping
    @Operation(
            summary = "Lister les détails de notes",
            description = "Retourne la liste complète des détails de notes"
    )
    @ApiResponse(responseCode = "200", description = "Liste récupérée avec succès")
    public List<NoteMentionDetail> all() {
        logger.info("[NoteMentionDetailController] GET /api/note_mention_details - Récupération");
        return service.getAll();
    }

    @GetMapping("/{id}")
    @Operation(
            summary = "Obtenir un détail de note par ID",
            description = "Retourne un détail de note à partir de son identifiant"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Détail trouvé"),
            @ApiResponse(responseCode = "404", description = "Détail introuvable")
    })
    public ResponseEntity<NoteMentionDetail> get(@PathVariable String id) {

        logger.info("[NoteMentionDetailController] GET /api/note_mention_details/{} - Récupération", id);

        return service.get(id)
                .map(detail -> {
                    logger.info("[NoteMentionDetailController] Détail {} trouvé", id);
                    return ResponseEntity.ok(detail);
                })
                .orElseGet(() -> {
                    logger.warn("[NoteMentionDetailController] Détail {} introuvable", id);
                    return ResponseEntity.notFound().build();
                });
    }

    @PostMapping
    @Operation(
            summary = "Créer un détail de note",
            description = "Crée un nouveau détail de note lié à une inscription et un ECUE"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Détail créé"),
            @ApiResponse(responseCode = "400", description = "Requête invalide")
    })
    public ResponseEntity<NoteMentionDetail> create(@RequestBody NoteMentionDetailDTO dto) {

        logger.info("[NoteMentionDetailController] POST /api/note_mention_details - Création");

        NoteMention note = noteService.get(dto.noteId)
                .orElseThrow(() -> new IllegalArgumentException("Note mention introuvable"));

        Inscription inscription = inscriptionService.get(dto.inscriptionId)
                .orElseThrow(() -> new IllegalArgumentException("Inscription introuvable"));

        MentionEcueDetail ecue = ecueService.get(dto.ecueId)
                .orElseThrow(() -> new IllegalArgumentException("Mention ECUE introuvable"));

        NoteMentionDetail instance = new NoteMentionDetail();
        instance.fromDTO(dto, note, inscription, ecue);

        NoteMentionDetail created = service.create(instance);

        logger.info("[NoteMentionDetailController] Détail créé avec succès - ID: {}", created.getId());

        return ResponseEntity
                .created(URI.create("/api/note_mention_details/" + created.getId()))
                .body(created);
    }

    @PutMapping("/{id}")
    @Operation(
            summary = "Mettre à jour un détail de note",
            description = "Met à jour un détail existant"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Détail mis à jour"),
            @ApiResponse(responseCode = "404", description = "Détail introuvable")
    })
    public ResponseEntity<NoteMentionDetail> update(
            @PathVariable String id,
            @RequestBody NoteMentionDetailDTO dto
    ) {

        logger.info("[NoteMentionDetailController] PUT /api/note_mention_details/{} - Mise à jour", id);

        return service.get(id)
                .map(existing -> {

                    NoteMention note = null;
                    if (dto.noteId != null) {
                        note = noteService.get(dto.noteId)
                                .orElseThrow(() -> new IllegalArgumentException("Note mention introuvable"));
                        existing.setNoteMention(note);
                    }

                    Inscription inscription = null;
                    if (dto.inscriptionId != null) {
                        inscription = inscriptionService.get(dto.inscriptionId)
                                .orElseThrow(() -> new IllegalArgumentException("Inscription introuvable"));
                        existing.setInscription(inscription);
                    }

                    MentionEcueDetail ecue = null;
                    if (dto.ecueId != null) {
                        ecue = ecueService.get(dto.ecueId)
                                .orElseThrow(() -> new IllegalArgumentException("Mention ECUE introuvable"));
                        existing.setEcue(ecue);
                    }

                    existing.fromDTO(dto, null, null, null );

                    NoteMentionDetail updated = service.update(id, existing);

                    logger.info("[NoteMentionDetailController] Détail {} mis à jour avec succès", id);

                    return ResponseEntity.ok(updated);
                })
                .orElseGet(() -> {
                    logger.warn("[NoteMentionDetailController] Détail {} introuvable", id);
                    return ResponseEntity.notFound().build();
                });
    }

    @DeleteMapping("/{id}")
    @Operation(
            summary = "Supprimer un détail de note",
            description = "Supprime un détail"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Détail supprimé"),
            @ApiResponse(responseCode = "404", description = "Détail introuvable")
    })
    public ResponseEntity<Void> delete(@PathVariable String id) {

        logger.info("[NoteMentionDetailController] DELETE /api/note_mention_details/{} - Suppression", id);

        if (service.get(id).isEmpty()) {
            logger.warn("[NoteMentionDetailController] Détail {} introuvable", id);
            return ResponseEntity.notFound().build();
        }

        service.delete(id);

        logger.info("[NoteMentionDetailController] Détail {} supprimé avec succès", id);

        return ResponseEntity.noContent().build();
    }
}