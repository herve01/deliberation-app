package com.deliberation.controller.deliberation;

import com.deliberation.dto.deliberation.EtudiantTransfertEcueDTO;
import com.deliberation.dto.deliberation.PersonnelDTO;
import com.deliberation.model.deliberation.EtudiantEcueTransfert;
import com.deliberation.model.deliberation.Personnel;
import com.deliberation.model.setting.Pays;
import com.deliberation.service.deliberation.EtudiantEcueTransfertService;
import com.deliberation.service.deliberation.PersonnelService;
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
@RequestMapping("/api/etudiant_ecue_transferts")
public class EtudiantEcueTransfertController {

    private final EtudiantEcueTransfertService service;

    private static final Logger logger = LoggerFactory.getLogger(EtudiantEcueTransfertController.class);

    public EtudiantEcueTransfertController(EtudiantEcueTransfertService service) {
        this.service = service;
    }

    @GetMapping
    @Operation(
            summary = "Lister les etudiant_ecue_transferts du jury",
            description = "Retourne la liste complète des etudiant_ecue_transferts du jury"
    )
    @ApiResponse(responseCode = "200", description = "Liste récupérée avec succès")
    public List<EtudiantEcueTransfert> all() {
        logger.info("[EtudiantEcueTransfertController] GET /api/etudiant_ecue_transferts - Récupération");
        return service.getAll();
    }

    @GetMapping("/{id}")
    @Operation(
            summary = "Obtenir un personnel du jury par ID",
            description = "Retourne un personnel du jury à partir de son identifiant"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "personnel trouvé"),
            @ApiResponse(responseCode = "404", description = "personnel introuvable")
    })
    public ResponseEntity<EtudiantEcueTransfert> get(@PathVariable String id) {

        logger.info("[EtudiantEcueTransfertController] GET /api/etudiant_ecue_transferts/{} - Récupération", id);

        return service.get(id)
                .map(personnel -> {
                    logger.info("[EtudiantEcueTransfertController] personnel {} trouvé", id);
                    return ResponseEntity.ok(personnel);
                })
                .orElseGet(() -> {
                    logger.warn("[EtudiantEcueTransfertController] personnel {} introuvable", id);
                    return ResponseEntity.notFound().build();
                });
    }

    @PostMapping
    @Operation(
            summary = "Créer un personnel du jury",
            description = "Crée un nouveau personnel du jury"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "personnel créé"),
            @ApiResponse(responseCode = "400", description = "Requête invalide")
    })
    public ResponseEntity<EtudiantEcueTransfert> create(@RequestBody EtudiantTransfertEcueDTO dto) {

        logger.info("[EtudiantEcueTransfertController] POST /api/etudiant_ecue_transferts - Création");

        var instance = new EtudiantEcueTransfert();
        instance.fromDTO(dto, null, null, null, null);

        var created = service.create(instance);

        logger.info("[EtudiantEcueTransfertController] personnel créé avec succès - ID: {}", created.getId());

        return ResponseEntity
                .created(URI.create("/api/etudiant_ecue_transferts/" + created.getId()))
                .body(created);
    }

    @PutMapping("/{id}")
    @Operation(
            summary = "Mettre à jour un personnel du jury",
            description = "Met à jour un personnel existant"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "personnel mis à jour"),
            @ApiResponse(responseCode = "404", description = "personnel introuvable")
    })
    public ResponseEntity<EtudiantEcueTransfert> update(
            @PathVariable String id,
            @RequestBody EtudiantTransfertEcueDTO dto
    ) {

        logger.info("[EtudiantEcueTransfertController] PUT /api/etudiant_ecue_transferts/{} - Mise à jour", id);

        return service.get(id)
                .map(existing -> {

                    /*Pays pays = null;
                    if (dto.paysNaissanceId != null) {
                        pays = paysService.get(dto.paysNaissanceId)
                                .orElseThrow(() -> new IllegalArgumentException("Pays introuvable"));
                        existing.setPaysNaissance(pays);
                    }*/

                    existing.fromDTO(dto, null, null, null, null);

                    var updated = service.update(id, existing);

                    logger.info("[EtudiantEcueTransfertController] personnel {} mis à jour avec succès", id);

                    return ResponseEntity.ok(updated);
                })
                .orElseGet(() -> {
                    logger.warn("[EtudiantEcueTransfertController] personnel {} introuvable", id);
                    return ResponseEntity.notFound().build();
                });
    }

    @DeleteMapping("/{id}")
    @Operation(
            summary = "Supprimer un personnel du jury",
            description = "Supprime un personnel"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "personnel supprimé"),
            @ApiResponse(responseCode = "404", description = "personnel introuvable")
    })
    public ResponseEntity<Void> delete(@PathVariable String id) {

        logger.info("[EtudiantEcueTransfertController] DELETE /api/etudiant_ecue_transferts/{} - Suppression", id);

        if (service.get(id).isEmpty()) {
            logger.warn("[EtudiantEcueTransfertController] personnel {} introuvable", id);
            return ResponseEntity.notFound().build();
        }

        service.delete(id);

        logger.info("[EtudiantEcueTransfertController] personnel {} supprimé avec succès", id);

        return ResponseEntity.noContent().build();
    }
}