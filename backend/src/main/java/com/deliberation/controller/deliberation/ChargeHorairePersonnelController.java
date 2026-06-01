package com.deliberation.controller.deliberation;

import com.deliberation.dto.deliberation.ChargeHorairePersonnelDTO;
import com.deliberation.model.cotation.MentionSemestreEcueDetail;
import com.deliberation.model.deliberation.Personnel;
import com.deliberation.model.deliberation.ChargeHorairePersonnel;
import com.deliberation.model.inscription.AnneeAcademique;
import com.deliberation.service.cotation.MentionSemestreEcueDetailService;
import com.deliberation.service.deliberation.ChargeHorairePersonnelService;
import com.deliberation.service.deliberation.PersonnelService;
import com.deliberation.service.inscription.AnneeService;
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
@RequestMapping("/api/affection_mention_ecue_personnels")
public class ChargeHorairePersonnelController {

    private final ChargeHorairePersonnelService service;
    private final PersonnelService personnelService;
    private final MentionSemestreEcueDetailService mentionService;
    private final AnneeService anneeService;

    private static final Logger logger = LoggerFactory.getLogger(ChargeHorairePersonnelController.class);

    public ChargeHorairePersonnelController(ChargeHorairePersonnelService service, PersonnelService personnelService, MentionSemestreEcueDetailService mentionService, AnneeService anneeService) {
        this.service = service;
        this.personnelService = personnelService;
        this.mentionService = mentionService;
        this.anneeService = anneeService;
    }

    @GetMapping
    @Operation(
            summary = "Lister les affection_mention_ecue_personnels du jury",
            description = "Retourne la liste complète des affection_mention_ecue_personnels du jury"
    )
    @ApiResponse(responseCode = "200", description = "Liste récupérée avec succès")
    public List<ChargeHorairePersonnel> all() {
        logger.info("[PersonnelController] GET /api/affection_mention_ecue_personnels - Récupération");
        return service.getAll();
    }

    @GetMapping("/{id}")
    @Operation(
            summary = "Obtenir un PersonnelAffectationMentionEcue du jury par ID",
            description = "Retourne un PersonnelAffectationMentionEcue du jury à partir de son identifiant"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "PersonnelAffectationMentionEcue trouvé"),
            @ApiResponse(responseCode = "404", description = "PersonnelAffectationMentionEcue introuvable")
    })
    public ResponseEntity<ChargeHorairePersonnel> get(@PathVariable String id) {

        logger.info("[PersonnelController] GET /api/affection_mention_ecue_personnels/{} - Récupération", id);

        return service.get(id)
                .map(PersonnelAffectationMentionEcue -> {
                    logger.info("[PersonnelController] PersonnelAffectationMentionEcue {} trouvé", id);
                    return ResponseEntity.ok(PersonnelAffectationMentionEcue);
                })
                .orElseGet(() -> {
                    logger.warn("[PersonnelController] PersonnelAffectationMentionEcue {} introuvable", id);
                    return ResponseEntity.notFound().build();
                });
    }

    @PostMapping
    @Operation(
            summary = "Créer un PersonnelAffectationMentionEcue du jury",
            description = "Crée un nouveau PersonnelAffectationMentionEcue du jury"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "PersonnelAffectationMentionEcue créé"),
            @ApiResponse(responseCode = "400", description = "Requête invalide")
    })
    public ResponseEntity<ChargeHorairePersonnel> create(@RequestBody ChargeHorairePersonnelDTO dto) {

        logger.info("[PersonnelController] POST /api/affection_mention_ecue_personnels - Création");

        Personnel personnel = personnelService.get(dto.personnelId)
                .orElseThrow(() -> new IllegalArgumentException("Personnel introuvable"));

        MentionSemestreEcueDetail mention = mentionService.get(dto.ecueId)
                .orElseThrow(() -> new IllegalArgumentException("Mention ecue detail introuvable"));

        AnneeAcademique annee = anneeService.get(dto.anneeId)
                .orElseThrow(() -> new IllegalArgumentException("MAnnée academique introuvable"));

        ChargeHorairePersonnel instance = new ChargeHorairePersonnel();
        instance.fromDTO(dto, personnel, mention, annee);

        ChargeHorairePersonnel created = service.create(instance);

        logger.info("[PersonnelController] PersonnelAffectationMentionEcue créé avec succès - ID: {}", created.getId());

        return ResponseEntity
                .created(URI.create("/api/affection_mention_ecue_personnels/" + created.getId()))
                .body(created);
    }

    @PutMapping("/{id}")
    @Operation(
            summary = "Mettre à jour un PersonnelAffectationMentionEcue du jury",
            description = "Met à jour un PersonnelAffectationMentionEcue existant"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "PersonnelAffectationMentionEcue mis à jour"),
            @ApiResponse(responseCode = "404", description = "PersonnelAffectationMentionEcue introuvable")
    })
    public ResponseEntity<ChargeHorairePersonnel> update(
            @PathVariable String id,
            @RequestBody ChargeHorairePersonnelDTO dto
    ) {

        logger.info("[PersonnelController] PUT /api/affection_mention_ecue_personnels/{} - Mise à jour", id);

        return service.get(id)
                .map(existing -> {

                    Personnel personnel = null;
                    if (dto.personnelId != null) {
                        personnel = personnelService.get(dto.personnelId)
                                .orElseThrow(() -> new IllegalArgumentException("Personnel introuvable"));
                        existing.setPersonnel(personnel);
                    }

                    MentionSemestreEcueDetail mention = null;
                    if (dto.ecueId != null) {
                        mention = mentionService.get(dto.ecueId)
                                .orElseThrow(() -> new IllegalArgumentException("Mention ecue detail introuvable"));
                        existing.setEcue(mention);
                    }

                    AnneeAcademique annee = null;
                    if (dto.anneeId != null) {
                        annee = anneeService.get(dto.anneeId)
                                .orElseThrow(() -> new IllegalArgumentException("Année academique introuvable"));
                        existing.setAnnee(annee);
                    }

                    existing.fromDTO(dto, null, null, null);

                    ChargeHorairePersonnel updated = service.update(id, existing);

                    logger.info("[PersonnelController] PersonnelAffectationMentionEcue {} mis à jour avec succès", id);

                    return ResponseEntity.ok(updated);
                })
                .orElseGet(() -> {
                    logger.warn("[PersonnelController] PersonnelAffectationMentionEcue {} introuvable", id);
                    return ResponseEntity.notFound().build();
                });
    }

    @DeleteMapping("/{id}")
    @Operation(
            summary = "Supprimer un PersonnelAffectationMentionEcue du jury",
            description = "Supprime un PersonnelAffectationMentionEcue"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "PersonnelAffectationMentionEcue supprimé"),
            @ApiResponse(responseCode = "404", description = "PersonnelAffectationMentionEcue introuvable")
    })
    public ResponseEntity<Void> delete(@PathVariable String id) {

        logger.info("[PersonnelController] DELETE /api/affection_mention_ecue_personnels/{} - Suppression", id);

        if (service.get(id).isEmpty()) {
            logger.warn("[PersonnelController] PersonnelAffectationMentionEcue {} introuvable", id);
            return ResponseEntity.notFound().build();
        }

        service.delete(id);

        logger.info("[PersonnelController] PersonnelAffectationMentionEcue {} supprimé avec succès", id);

        return ResponseEntity.noContent().build();
    }
}