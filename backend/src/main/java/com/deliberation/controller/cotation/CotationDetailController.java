package com.deliberation.controller.cotation;

import com.deliberation.dto.cotation.CotationDetailDTO;
import com.deliberation.model.cotation.MentionSemestreEcueDetail;
import com.deliberation.model.cotation.Cotation;
import com.deliberation.model.cotation.CotationDetail;
import com.deliberation.model.cotation.pojo.MentionSemestreEcuePojo;
import com.deliberation.model.deliberation.pojo.DeliberationPojo;
import com.deliberation.model.inscription.Inscription;
import com.deliberation.service.cotation.MentionSemestreEcueDetailService;
import com.deliberation.service.cotation.CotationDetailService;
import com.deliberation.service.cotation.CotationService;
import com.deliberation.service.cotation.MentionSemestreEcueService;
import com.deliberation.service.inscription.InscriptionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/cotation_details")
public class CotationDetailController {

    private final CotationDetailService service;
    private final CotationService cotationService;
    private final InscriptionService inscriptionService;
    private final MentionSemestreEcueDetailService mentionSemestreEcueDetailService;
    private final MentionSemestreEcueService mentionService;


    private static final Logger logger = LoggerFactory.getLogger(CotationDetailController.class);

    public CotationDetailController(
            CotationDetailService service,
            CotationService cotationService,
            InscriptionService inscriptionService,
            MentionSemestreEcueDetailService mentionSemestreEcueDetailService,
            MentionSemestreEcueService mentionService

    ) {
        this.service = service;
        this.cotationService = cotationService;
        this.inscriptionService = inscriptionService;
        this.mentionSemestreEcueDetailService = mentionSemestreEcueDetailService;
        this.mentionService = mentionService;
    }

    @GetMapping
    @Operation(
            summary = "Lister les détails de notes",
            description = "Retourne la liste complète des détails de notes"
    )
    @ApiResponse(responseCode = "200", description = "Liste récupérée avec succès")
    public List<CotationDetail> all() {
        logger.info("[CotationDetailController] GET /api/cotation_details - Récupération");
        return service.getAll();
    }

    @GetMapping("/cotation/{cotationId}/ecue/{ecueId}")
    @Operation(
            summary = "Lister les détails de cotation",
            description = "Retourne la liste des détails de cotation filtrés par cotation et ECUE"
    )
    @ApiResponse(responseCode = "200", description = "Liste récupérée avec succès")
    public List<CotationDetail> all(@PathVariable String cotationId, @PathVariable String ecueId) {
        logger.info("[CotationDetailController] GET /api/cotation_details - Récupération");
        return service.getAll(cotationId, ecueId);
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
    public ResponseEntity<CotationDetail> get(@PathVariable String id) {

        logger.info("[CotationDetailController] GET /api/cotation_details/{} - Récupération", id);

        return service.get(id)
                .map(detail -> {
                    logger.info("[CotationDetailController] Détail {} trouvé", id);
                    return ResponseEntity.ok(detail);
                })
                .orElseGet(() -> {
                    logger.warn("[CotationDetailController] Détail {} introuvable", id);
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
    public ResponseEntity<CotationDetail> create(@RequestBody CotationDetailDTO dto) {

        logger.info("[CotationDetailController] POST /api/cotation_details - Création");

        Cotation note = cotationService.get(dto.cotationId)
                .orElseThrow(() -> new IllegalArgumentException("Note mention introuvable"));

        Inscription inscription = inscriptionService.get(dto.inscriptionId)
                .orElseThrow(() -> new IllegalArgumentException("Inscription introuvable"));

        MentionSemestreEcueDetail ecue = mentionSemestreEcueDetailService.get(dto.mentionSemestreEcueId)
                .orElseThrow(() -> new IllegalArgumentException("Mention ECUE introuvable"));

        CotationDetail instance = new CotationDetail();
        instance.fromDTO(dto, note, inscription, ecue);

        CotationDetail created = service.create(instance);

        logger.info("[CotationDetailController] Détail créé avec succès - ID: {}", created.getId());

        return ResponseEntity
                .created(URI.create("/api/cotation_details/" + created.getId()))
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
    public ResponseEntity<CotationDetail> update(
            @PathVariable String id,
            @RequestBody CotationDetailDTO dto
    ) {

        logger.info("[CotationDetailController] PUT /api/cotation_details/{} - Mise à jour", id);

        return service.get(id)
                .map(existing -> {

                    Cotation note = null;
                    if (dto.cotationId != null) {
                        note = cotationService.get(dto.cotationId)
                                .orElseThrow(() -> new IllegalArgumentException("Note mention introuvable"));
                        existing.setCotation(note);
                    }

                    Inscription inscription = null;
                    if (dto.inscriptionId != null) {
                        inscription = inscriptionService.get(dto.inscriptionId)
                                .orElseThrow(() -> new IllegalArgumentException("Inscription introuvable"));
                        existing.setInscription(inscription);
                    }

                    MentionSemestreEcueDetail ecue = null;
                    if (dto.mentionSemestreEcueId != null) {
                        ecue = mentionSemestreEcueDetailService.get(dto.mentionSemestreEcueId)
                                .orElseThrow(() -> new IllegalArgumentException("Mention ECUE introuvable"));
                        existing.setMentionSemestreEcue(ecue);
                    }

                    existing.fromDTO(dto, null, null, null );

                    CotationDetail updated = service.update(id, existing);

                    logger.info("[CotationDetailController] Détail {} mis à jour avec succès", id);

                    return ResponseEntity.ok(updated);
                })
                .orElseGet(() -> {
                    logger.warn("[CotationDetailController] Détail {} introuvable", id);
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

        logger.info("[CotationDetailController] DELETE /api/cotation_details/{} - Suppression", id);

        if (service.get(id).isEmpty()) {
            logger.warn("[CotationDetailController] Détail {} introuvable", id);
            return ResponseEntity.notFound().build();
        }

        service.delete(id);

        logger.info("[CotationDetailController] Détail {} supprimé avec succès", id);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/mention/{mentionId}/semestre/{semestreId}/annee/{anneeId}/session/{sessionId}")
    @Operation(
            summary = "Lister les détails mention-ECUE",
            description = "Retourne la liste des détails mention-ECUE avec statistiques de cotation"
    )
    @ApiResponse(responseCode = "200", description = "Liste récupérée avec succès")
    public List<MentionSemestreEcuePojo> all(@PathVariable String mentionId, @PathVariable String semestreId, @PathVariable String anneeId, @PathVariable String sessionId) {

        logger.info("[MentionSemestreEcueDetailController] GET /api/mention_semestre_ecue_details - Récupération");

        var mention = mentionService.get(mentionId, semestreId, anneeId)
                .orElseThrow(() -> new IllegalArgumentException("Mention semestre introuvable"));

        var cotation = cotationService.get(anneeId, mentionId, semestreId, sessionId);

        long total = inscriptionService.count(anneeId, mentionId);

        return mentionSemestreEcueDetailService.getAll(mention.getId())
            .stream()
            .map(mentionSemestreEcueDetail -> {
                var m = new MentionSemestreEcuePojo();
                var eches = service.countEchecsByMentionSemestreEcue(mentionId, anneeId, semestreId, sessionId, mentionSemestreEcueDetail.getId()).orElse(null);

                var countWithCote = cotation.map(c -> service.count(c.getId(), mentionSemestreEcueDetail.getId())).orElse(0L);
                var countManqueCote = total - countWithCote;

                m.setMentionSemestreEcueDetail(mentionSemestreEcueDetail);
                m.setCountWithCote(countWithCote);
                m.setCountManqueCote(countManqueCote);
                m.setEchec(eches);

                return m;
            })
            .toList();
    }

}