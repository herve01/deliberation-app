package com.deliberation.controller.deliberation;

import com.deliberation.dto.deliberation.JuryMembreDetailDTO;
import com.deliberation.model.deliberation.Personnel;
import com.deliberation.model.deliberation.JuryMembreDetail;
import com.deliberation.model.deliberation.pojo.DeliberationMentionPojo;
import com.deliberation.model.deliberation.pojo.MembreJuryMentionPojo;
import com.deliberation.model.inscription.AnneeAcademique;
import com.deliberation.model.inscription.Mention;
import com.deliberation.service.deliberation.PersonnelService;
import com.deliberation.service.deliberation.JuryMembreDetailService;
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
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/jury_membre_details")
public class JuryMembreDetailController {

    private final JuryMembreDetailService service;
    private final MentionService mentionService;
    private final PersonnelService personnelService;
    private final AnneeService anneeService;

    private static final Logger logger = LoggerFactory.getLogger(JuryMembreDetailController.class);

    public JuryMembreDetailController(
            JuryMembreDetailService service, MentionService mentionService,
            PersonnelService personnelService,
            AnneeService anneeService
    ) {
        this.service = service;
        this.mentionService = mentionService;
        this.personnelService = personnelService;
        this.anneeService = anneeService;
    }

    @GetMapping
    @Operation(
            summary = "Lister les détails jury-mention",
            description = "Retourne la liste complète des affectations jury-mention"
    )
    @ApiResponse(responseCode = "200", description = "Liste récupérée avec succès")
    public List<JuryMembreDetail> all() {
        logger.info("[MentionJuryMembreDetailController] GET /api/mention_jury_membre_details - Récupération");
        return service.getAll();
    }

    @GetMapping("/{id}")
    @Operation(
            summary = "Obtenir un détail jury-mention par ID",
            description = "Retourne un détail à partir de son identifiant"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Détail trouvé"),
            @ApiResponse(responseCode = "404", description = "Détail introuvable")
    })
    public ResponseEntity<JuryMembreDetail> get(@PathVariable String id) {

        logger.info("[MentionJuryMembreDetailController] GET /api/mention_jury_membre_details/{} - Récupération", id);

        return service.get(id)
                .map(detail -> {
                    logger.info("[MentionJuryMembreDetailController] Détail {} trouvé", id);
                    return ResponseEntity.ok(detail);
                })
                .orElseGet(() -> {
                    logger.warn("[MentionJuryMembreDetailController] Détail {} introuvable", id);
                    return ResponseEntity.notFound().build();
                });
    }

    @PostMapping
    @Operation(
            summary = "Créer un détail jury-mention",
            description = "Crée une nouvelle affectation entre jury et année académique"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Détail créé"),
            @ApiResponse(responseCode = "400", description = "Requête invalide")
    })
    public ResponseEntity<JuryMembreDetail> create(@RequestBody JuryMembreDetailDTO dto) {

        logger.info("[MentionJuryMembreDetailController] POST /api/mention_jury_membre_details - Création");

        var mention = mentionService.get(dto.mentionId)
                .orElseThrow(() -> new IllegalArgumentException("Mention introuvable"));

        var personnel = personnelService.get(dto.personnelId)
                .orElseThrow(() -> new IllegalArgumentException("Jury introuvable"));

        var annee = anneeService.get(dto.anneeId)
                .orElseThrow(() -> new IllegalArgumentException("Année académique introuvable"));

        var instance = new JuryMembreDetail();
        instance.fromDTO(dto, mention, personnel, annee);

        JuryMembreDetail created = service.create(instance);

        logger.info("[MentionJuryMembreDetailController] Détail créé avec succès - ID: {}", created.getId());

        return ResponseEntity
                .created(URI.create("/api/mention_jury_membre_details/" + created.getId()))
                .body(created);
    }

    @PostMapping("/add_all")
    @Operation(
            summary = "Créer un détail jury-mention",
            description = "Crée une nouvelle affectation entre jury et année académique"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Détail créé"),
            @ApiResponse(responseCode = "400", description = "Requête invalide")
    })
    public ResponseEntity<List<JuryMembreDetail>> createAll(@RequestBody List<JuryMembreDetailDTO> dtos) {

        logger.info("[MentionJuryMembreDetailController] POST /api/mention_jury_membre_details - Création");

        List<JuryMembreDetail> instances = new ArrayList<>();

        dtos.forEach(dto ->{
            var mention = mentionService.get(dto.mentionId)
                    .orElseThrow(() -> new IllegalArgumentException("Mention introuvable"));

            var personnel = personnelService.get(dto.personnelId)
                    .orElseThrow(() -> new IllegalArgumentException("Jury introuvable"));

            var annee = anneeService.get(dto.anneeId)
                    .orElseThrow(() -> new IllegalArgumentException("Année académique introuvable"));

            var instance = new JuryMembreDetail();
            instance.fromDTO(dto, mention, personnel, annee);

            instances.add(instance);
        });

        var created = service.createAll(instances);

        logger.info("[MentionJuryMembreDetailController] Détail créé avec succès - ID: {}", created.stream().count());

        return ResponseEntity
                .created(URI.create("/api/mention_jury_membre_details/" + created.stream().count()))
                .body(created);
    }

    @PutMapping("/{id}")
    @Operation(
            summary = "Mettre à jour un détail jury-mention",
            description = "Met à jour un détail existant"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Détail mis à jour"),
            @ApiResponse(responseCode = "404", description = "Détail introuvable")
    })
    public ResponseEntity<JuryMembreDetail> update(
            @PathVariable String id,
            @RequestBody JuryMembreDetailDTO dto
    ) {

        logger.info("[MentionJuryMembreDetailController] PUT /api/mention_jury_membre_details/{} - Mise à jour", id);

        return service.get(id)
                .map(existing -> {

                    Mention mention = null;
                    if (dto.mentionId != null) {
                        mention = mentionService.get(dto.mentionId)
                                .orElseThrow(() -> new IllegalArgumentException("Mention introuvable"));
                        existing.setMention(mention);
                    }

                    Personnel personnel = null;
                    if (dto.personnelId != null) {
                        personnel = personnelService.get(dto.personnelId)
                                .orElseThrow(() -> new IllegalArgumentException("Jury introuvable"));
                        existing.setPersonnel(personnel);
                    }

                    AnneeAcademique annee = null;
                    if (dto.anneeId != null) {
                        annee = anneeService.get(dto.anneeId)
                                .orElseThrow(() -> new IllegalArgumentException("Année académique introuvable"));
                        existing.setAnnee(annee);
                    }

                    existing.fromDTO(dto, null, null, null);

                    JuryMembreDetail updated = service.update(id, existing);

                    logger.info("[MentionJuryMembreDetailController] Détail {} mis à jour avec succès", id);

                    return ResponseEntity.ok(updated);
                })
                .orElseGet(() -> {
                    logger.warn("[MentionJuryMembreDetailController] Détail {} introuvable", id);
                    return ResponseEntity.notFound().build();
                });
    }

    @DeleteMapping("/{id}")
    @Operation(
            summary = "Supprimer un détail jury-mention",
            description = "Supprime un détail"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Détail supprimé"),
            @ApiResponse(responseCode = "404", description = "Détail introuvable")
    })
    public ResponseEntity<Void> delete(@PathVariable String id) {

        logger.info("[MentionJuryMembreDetailController] DELETE /api/mention_jury_membre_details/{} - Suppression", id);

        if (service.get(id).isEmpty()) {
            logger.warn("[MentionJuryMembreDetailController] Détail {} introuvable", id);
            return ResponseEntity.notFound().build();
        }

        service.delete(id);

        logger.info("[MentionJuryMembreDetailController] Détail {} supprimé avec succès", id);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/annee/{anneeId}/mention/{mentionId}/details")
    @Operation(summary = "Lister les membres du jury par année et mention")
    public ResponseEntity<MembreJuryMentionPojo> getByAnneeMention(
            @PathVariable String anneeId, @PathVariable String mentionId) {

        logger.info("[DeliberationDetailController] GET /api/jury_membre_details/annee/{}/mention/{}/details",
                anneeId, mentionId);

        var annee = anneeService.get(anneeId).orElse(null);

        return mentionService.get(mentionId)
            .map(mention -> {
                var jury = new MembreJuryMentionPojo();
                var details = service.getAll(anneeId, mention.getId());
                jury.setMention(mention);
                jury.setAnnee(annee);
                jury.setDetails(details);

                return ResponseEntity.ok(jury);
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/annee/{anneeId}/details")
    @Operation(summary = "Lister les membres du jury par année")
    public List<MembreJuryMentionPojo> getAllByAnnee(@PathVariable String anneeId) {

        logger.info("[DeliberationDetailController] GET /api/jury_membre_details/annee/{}/details", anneeId);

        var annee = anneeService.get(anneeId).orElse(null);

        return mentionService.getAll()
            .stream()
            .map(mention -> {
                var jury = new MembreJuryMentionPojo();
                jury.setMention(mention);
                jury.setAnnee(annee);
                jury.setDetails(service.getAll(anneeId, mention.getId()));

                return jury;
            })
            .toList();
    }
}