package com.deliberation.controller.deliberation;

import com.deliberation.dto.deliberation.DeliberationDetailDTO;
import com.deliberation.model.cotation.Cotation;
import com.deliberation.model.cotation.MentionSemestreEcue;
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
    private final CategorieService categorieService;

    private static final Logger logger = LoggerFactory.getLogger(DeliberationDetailController.class);

    public DeliberationDetailController(
            DeliberationDetailService service, DeliberationService deliberationService,
            InscriptionService inscriptionService, MentionSemestreEcueDetailService mentionSemestreEcueDetailService, MentionSemestreEcueService mentionSemestreEcueService, CotationService cotationService, CotationDetailService cotationDetailService, SessionService sessionService, CategorieService categorieService
    ) {
        this.service = service;
        this.deliberationService = deliberationService;
        this.inscriptionService = inscriptionService;
        this.mentionSemestreEcueDetailService = mentionSemestreEcueDetailService;
        this.mentionSemestreEcueService = mentionSemestreEcueService;
        this.cotationService = cotationService;
        this.cotationDetailService = cotationDetailService;
        this.sessionService = sessionService;
        this.categorieService = categorieService;
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
            .map(deliberation -> {
                logger.info("[DeliberationMentionDetailController] Détail {} trouvé", id);
                return ResponseEntity.ok(deliberation);
            })
            .orElseGet(() -> {
                logger.warn("[DeliberationMentionDetailController] Détail {} introuvable", id);
                return ResponseEntity.notFound().build();
            });
    }

    @GetMapping("/inscription/{inscriptionId}/semestre/{semestreId}/session/{sessionId}/previous")
    @Operation(
            summary = "Obtenir la délibération précédente d'une inscription",
            description = "Retourne la dernière délibération précédente correspondant à l'inscription, au semestre et à la session."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Délibération trouvée"),
            @ApiResponse(responseCode = "404", description = "Aucune délibération trouvée")
    })
    public ResponseEntity<DeliberationDetail> getPrevious(
            @PathVariable String inscriptionId,
            @PathVariable String semestreId,
            @PathVariable String sessionId) {

        logger.info("[DeliberationDetailController] GET /api/deliberation_details/inscription/{}/semestre/{}/session/{}/previous",
                inscriptionId, semestreId, sessionId);

        return service.getPrevious(inscriptionId, semestreId, sessionId)
            .map(deliberation -> {
                logger.info(
                        "[DeliberationDetailController] Délibération précédente trouvée pour l'inscription {}",
                        inscriptionId);
                return ResponseEntity.ok(deliberation);
            })
            .orElseGet(() -> {
                logger.warn(
                        "[DeliberationDetailController] Aucune délibération précédente trouvée pour l'inscription {}",
                        inscriptionId);
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
    public List<DeliberationPojo> getAllByAnneeMentionSemestreSession(
            @PathVariable String anneeId, @PathVariable String mentionId,
            @PathVariable String semestreId, @PathVariable String sessionId
    ) {

        logger.info("[DeliberationDetailController] GET /api/deliberation_details/annee/{}/mention/{}/semestre/{}/session/{}/deliberation",
                anneeId, mentionId, semestreId, sessionId);

        var mentionSemestres = mentionSemestreEcueService.getAll(mentionId, semestreId, anneeId);

        //var sessions = sessionService.getAll(semestreId, sessionId);

        var deliberationOpt = deliberationService.get(mentionId, semestreId, anneeId, sessionId);

        Float credits = "-1".equals(semestreId.trim())
                ? Optional.ofNullable(mentionSemestreEcueDetailService.sum(mentionSemestres)).orElse(0F)
                : Optional.ofNullable(mentionSemestreEcueDetailService.sum(mentionSemestres.get(0).getId())).orElse(0F);

        return inscriptionService.getAllBy(anneeId, mentionId, semestreId, sessionId)
            .stream()
            .map(inscription -> {

                var deliberation = deliberationOpt
                    .flatMap(delib  -> service.get(delib.getId(), inscription.getId(), semestreId)).
                    orElse(new DeliberationDetail());

                if (deliberation.getId() == null) {
                    float newCredits = service.getPrevious(inscription.getId(), semestreId, sessionId)
                            .map(DeliberationDetail::getTransferes)
                            .orElse(credits);

                    deliberation.setCredits(newCredits);
                    if("-1".equals(semestreId.trim())) {
                       var all = service.get(null, inscription.getId(), semestreId);
                        deliberation.setValides(all.get().getValides());
                        //deliberation.setTransferes(all.get().getTransferes());
                        deliberation.setMoyenne(all.get().getMoyenne());
                    }
                    else {
                        deliberation.setValides(null);
                        deliberation.setTransferes(null);
                    }
                }

                var item = new DeliberationPojo();
                item.setInscription(inscription);
                item.setDeliberation(deliberation);

                return item;
            })
            .toList();
    }

    @GetMapping("/annee/{anneeId}/mention/{mentionId}/semestre/{semestreId}/session/{sessionId}/details")
    @Operation(summary = "Lister les inscriptions d'un étudiant par année")
    public List<DeliberationMentionPojo> getAllTTByAnneeMentionSemestreSession(
            @PathVariable String anneeId, @PathVariable String mentionId, @PathVariable String semestreId, @PathVariable String sessionId) {

        logger.info("[DeliberationDetailController] GET /api/deliberation_details/annee/{}/mention/{}/semestre/{}/session/{}/traitement",
                anneeId, mentionId, semestreId, sessionId);

        var mentionSemestre = mentionSemestreEcueService.getOne(mentionId, semestreId, anneeId);

        var sessions = sessionService.getAll(semestreId, sessionId);

        if (mentionSemestre.isEmpty() || sessions.isEmpty()) {
            return List.of();
        }

        Float credits = Optional.ofNullable(
                mentionSemestreEcueDetailService.sum(mentionSemestre.get().getId())
        ).orElse(0F);

        var deliberationOpt = deliberationService.get(mentionId, semestreId, anneeId, sessionId);

        var categories = categorieService.getAll();

        return inscriptionService.getAllBy(anneeId, mentionId, semestreId, sessionId)
            .stream()
            .map(inscription -> {

                var d = new DeliberationMentionPojo(categories);
                d.setInscription(inscription);

                var deliberation = deliberationOpt
                    .flatMap(delib  -> service.get(delib.getId(), inscription.getId())).
                    orElse(null);

                sessions.forEach(s -> {
                    var items = cotationService.get(anneeId, mentionId, semestreId, s.getId())
                        .map(c -> cotationDetailService.getAllByCotationInscription(
                                c.getId(),
                                inscription.getId()
                        ))
                        .orElse(List.of());

                    if (s.getNumero() < 0 || Boolean.TRUE.equals(s.getEstAnnuel())) {
                        d.setAnnuels(items);
                    } else if (s.getNumero() == 1 && Boolean.FALSE.equals(s.getEstAnnuel())) {
                        d.setExamens(items);
                    } else if (s.getNumero() == 2 && Boolean.FALSE.equals(s.getEstAnnuel())) {
                        d.setRattrapages(items);
                    }
                });

                var details = mentionSemestreEcueDetailService.getAll(mentionSemestre.get().getId());

                if(deliberation == null)
                    d.getDeliberation().setCredits(credits);
                else
                    d.setDeliberation(deliberation);

                d.setMentionSemestreEcueDetails(details);

                return d;
            })
            .toList();
    }

    @GetMapping("/inscription/{inscriptionId}/semestre/{semestreId}/session/{sessionId}/details")
    @Operation(summary = "Lister les détails de délibération d'une inscription")
    public ResponseEntity<DeliberationMentionPojo> getDetailByInscriptionSemestreSession(
            @PathVariable String inscriptionId, @PathVariable String semestreId, @PathVariable String sessionId) {

        var inscriptionOpt = inscriptionService.get(inscriptionId);
        var categories = categorieService.getAll();
        var sessions = sessionService.getAll(semestreId, sessionId);

        if (inscriptionOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        var inscription = inscriptionOpt.get();
        var anneeId = inscription.getAnnee().getId();
        var mentionId = inscription.getMention().getId();

        var mentionSemestreOpt = mentionSemestreEcueService.getOne(mentionId, semestreId, anneeId);
        var deliberationOpt = deliberationService.get(mentionId, semestreId, anneeId, sessionId);

        if (mentionSemestreOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        var mentionSemestre = mentionSemestreOpt.get();

        Float credits = Optional.ofNullable(mentionSemestreEcueDetailService.sum(mentionSemestre.getId())
        ).orElse(0F);

        var details = mentionSemestreEcueDetailService.getAll(mentionSemestre.getId());

        var deliberation = deliberationOpt
                .flatMap(d  -> service.get(d.getId(), inscription.getId())).
                orElse(null);

        var result = new DeliberationMentionPojo(categories);
        result.setInscription(inscription);
        result.setDeliberation(deliberation);

        sessions.forEach(s -> {
            var items = cotationService.get(anneeId, mentionId, semestreId, s.getId())
                    .map(c -> cotationDetailService.getAllByCotationInscription(
                            c.getId(),
                            inscription.getId()
                    ))
                    .orElse(List.of());

            if (s.getNumero() < 0 || Boolean.TRUE.equals(s.getEstAnnuel())) {
                result.setAnnuels(items);
            } else if (s.getNumero() == 1 && Boolean.FALSE.equals(s.getEstAnnuel())) {
                result.setExamens(items);
            } else if (s.getNumero() == 2 && Boolean.FALSE.equals(s.getEstAnnuel())) {
                result.setRattrapages(items);
            }
        });

        result.setMentionSemestreEcueDetails(details);

        return ResponseEntity.ok(result);
    }
}