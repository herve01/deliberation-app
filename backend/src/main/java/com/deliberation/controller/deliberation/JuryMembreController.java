package com.deliberation.controller.deliberation;

import com.deliberation.dto.deliberation.JuryMembreDTO;
import com.deliberation.model.deliberation.JuryMembre;
import com.deliberation.model.setting.Pays;
import com.deliberation.service.deliberation.JuryMembreService;
import com.deliberation.service.setting.PaysService;
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
@RequestMapping("/api/jury_membres")
public class JuryMembreController {

    private final JuryMembreService service;
    private final PaysService paysService;

    private static final Logger logger = LoggerFactory.getLogger(JuryMembreController.class);

    public JuryMembreController(JuryMembreService service, PaysService paysService) {
        this.service = service;
        this.paysService = paysService;
    }

    @GetMapping
    @Operation(
            summary = "Lister les membres du jury",
            description = "Retourne la liste complète des membres du jury"
    )
    @ApiResponse(responseCode = "200", description = "Liste récupérée avec succès")
    public List<JuryMembre> all() {
        logger.info("[JuryMembreController] GET /api/jury_membres - Récupération");
        return service.getAll();
    }

    @GetMapping("/{id}")
    @Operation(
            summary = "Obtenir un membre du jury par ID",
            description = "Retourne un membre du jury à partir de son identifiant"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Membre trouvé"),
            @ApiResponse(responseCode = "404", description = "Membre introuvable")
    })
    public ResponseEntity<JuryMembre> get(@PathVariable String id) {

        logger.info("[JuryMembreController] GET /api/jury_membres/{} - Récupération", id);

        return service.get(id)
                .map(membre -> {
                    logger.info("[JuryMembreController] Membre {} trouvé", id);
                    return ResponseEntity.ok(membre);
                })
                .orElseGet(() -> {
                    logger.warn("[JuryMembreController] Membre {} introuvable", id);
                    return ResponseEntity.notFound().build();
                });
    }

    @PostMapping
    @Operation(
            summary = "Créer un membre du jury",
            description = "Crée un nouveau membre du jury"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Membre créé"),
            @ApiResponse(responseCode = "400", description = "Requête invalide")
    })
    public ResponseEntity<JuryMembre> create(@RequestBody JuryMembreDTO dto) {

        logger.info("[JuryMembreController] POST /api/jury_membres - Création");

        Pays pays = paysService.get(dto.paysNaissanceId)
                .orElseThrow(() -> new IllegalArgumentException("Pays introuvable"));

        JuryMembre instance = new JuryMembre();
        instance.fromDTO(dto, pays);

        JuryMembre created = service.create(instance);

        logger.info("[JuryMembreController] Membre créé avec succès - ID: {}", created.getId());

        return ResponseEntity
                .created(URI.create("/api/jury_membres/" + created.getId()))
                .body(created);
    }

    @PutMapping("/{id}")
    @Operation(
            summary = "Mettre à jour un membre du jury",
            description = "Met à jour un membre existant"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Membre mis à jour"),
            @ApiResponse(responseCode = "404", description = "Membre introuvable")
    })
    public ResponseEntity<JuryMembre> update(
            @PathVariable String id,
            @RequestBody JuryMembreDTO dto
    ) {

        logger.info("[JuryMembreController] PUT /api/jury_membres/{} - Mise à jour", id);

        return service.get(id)
                .map(existing -> {

                    Pays pays = null;
                    if (dto.paysNaissanceId != null) {
                        pays = paysService.get(dto.paysNaissanceId)
                                .orElseThrow(() -> new IllegalArgumentException("Pays introuvable"));
                        existing.setPaysNaissance(pays);
                    }

                    existing.fromDTO(dto, pays);

                    JuryMembre updated = service.update(id, existing);

                    logger.info("[JuryMembreController] Membre {} mis à jour avec succès", id);

                    return ResponseEntity.ok(updated);
                })
                .orElseGet(() -> {
                    logger.warn("[JuryMembreController] Membre {} introuvable", id);
                    return ResponseEntity.notFound().build();
                });
    }

    @DeleteMapping("/{id}")
    @Operation(
            summary = "Supprimer un membre du jury",
            description = "Supprime un membre"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Membre supprimé"),
            @ApiResponse(responseCode = "404", description = "Membre introuvable")
    })
    public ResponseEntity<Void> delete(@PathVariable String id) {

        logger.info("[JuryMembreController] DELETE /api/jury_membres/{} - Suppression", id);

        if (service.get(id).isEmpty()) {
            logger.warn("[JuryMembreController] Membre {} introuvable", id);
            return ResponseEntity.notFound().build();
        }

        service.delete(id);

        logger.info("[JuryMembreController] Membre {} supprimé avec succès", id);

        return ResponseEntity.noContent().build();
    }
}