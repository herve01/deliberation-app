package com.deliberation.controller.deliberation;

import com.deliberation.dto.deliberation.MentionJuryMembreDetailDTO;
import com.deliberation.model.deliberation.JuryMembre;
import com.deliberation.model.deliberation.MentionJuryMembreDetail;
import com.deliberation.model.inscription.AnneeAcademique;
import com.deliberation.service.deliberation.JuryMembreService;
import com.deliberation.service.deliberation.MentionJuryMembreDetailService;
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
@RequestMapping("/api/mention_jury_membre_details")
public class MentionJuryMembreDetailController {

    private final MentionJuryMembreDetailService service;
    private final JuryMembreService juryMembreService;
    private final AnneeService anneeService;

    private static final Logger logger = LoggerFactory.getLogger(MentionJuryMembreDetailController.class);

    public MentionJuryMembreDetailController(
            MentionJuryMembreDetailService service,
            JuryMembreService juryMembreService,
            AnneeService anneeService
    ) {
        this.service = service;
        this.juryMembreService = juryMembreService;
        this.anneeService = anneeService;
    }

    @GetMapping
    @Operation(
            summary = "Lister les détails jury-mention",
            description = "Retourne la liste complète des affectations jury-mention"
    )
    @ApiResponse(responseCode = "200", description = "Liste récupérée avec succès")
    public List<MentionJuryMembreDetail> all() {
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
    public ResponseEntity<MentionJuryMembreDetail> get(@PathVariable String id) {

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
    public ResponseEntity<MentionJuryMembreDetail> create(@RequestBody MentionJuryMembreDetailDTO dto) {

        logger.info("[MentionJuryMembreDetailController] POST /api/mention_jury_membre_details - Création");

        JuryMembre jury = juryMembreService.get(dto.juryId)
                .orElseThrow(() -> new IllegalArgumentException("Jury introuvable"));

        AnneeAcademique annee = anneeService.get(dto.anneeId)
                .orElseThrow(() -> new IllegalArgumentException("Année académique introuvable"));

        MentionJuryMembreDetail instance = new MentionJuryMembreDetail();
        instance.fromDTO(dto, jury, annee);

        MentionJuryMembreDetail created = service.create(instance);

        logger.info("[MentionJuryMembreDetailController] Détail créé avec succès - ID: {}", created.getId());

        return ResponseEntity
                .created(URI.create("/api/mention_jury_membre_details/" + created.getId()))
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
    public ResponseEntity<MentionJuryMembreDetail> update(
            @PathVariable String id,
            @RequestBody MentionJuryMembreDetailDTO dto
    ) {

        logger.info("[MentionJuryMembreDetailController] PUT /api/mention_jury_membre_details/{} - Mise à jour", id);

        return service.get(id)
                .map(existing -> {

                    JuryMembre jury = null;
                    if (dto.juryId != null) {
                        jury = juryMembreService.get(dto.juryId)
                                .orElseThrow(() -> new IllegalArgumentException("Jury introuvable"));
                        existing.setJury(jury);
                    }

                    AnneeAcademique annee = null;
                    if (dto.anneeId != null) {
                        annee = anneeService.get(dto.anneeId)
                                .orElseThrow(() -> new IllegalArgumentException("Année académique introuvable"));
                        existing.setAnnee(annee);
                    }

                    existing.fromDTO(dto, jury, annee);

                    MentionJuryMembreDetail updated = service.update(id, existing);

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
}