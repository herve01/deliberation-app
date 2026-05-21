package com.deliberation.controller.deliberation;

import com.deliberation.dto.deliberation.PersonnelDTO;
import com.deliberation.model.deliberation.Personnel;
import com.deliberation.model.setting.Pays;
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
@RequestMapping("/api/personnels")
public class PersonnelController {

    private final PersonnelService service;
    private final PaysService paysService;

    private static final Logger logger = LoggerFactory.getLogger(PersonnelController.class);

    public PersonnelController(PersonnelService service, PaysService paysService) {
        this.service = service;
        this.paysService = paysService;
    }

    @GetMapping
    @Operation(
            summary = "Lister les personnels du jury",
            description = "Retourne la liste complète des personnels du jury"
    )
    @ApiResponse(responseCode = "200", description = "Liste récupérée avec succès")
    public List<Personnel> all() {
        logger.info("[PersonnelController] GET /api/personnels - Récupération");
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
    public ResponseEntity<Personnel> get(@PathVariable String id) {

        logger.info("[PersonnelController] GET /api/personnels/{} - Récupération", id);

        return service.get(id)
                .map(personnel -> {
                    logger.info("[PersonnelController] personnel {} trouvé", id);
                    return ResponseEntity.ok(personnel);
                })
                .orElseGet(() -> {
                    logger.warn("[PersonnelController] personnel {} introuvable", id);
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
    public ResponseEntity<Personnel> create(@RequestBody PersonnelDTO dto) {

        logger.info("[PersonnelController] POST /api/personnels - Création");

        Pays pays = paysService.get(dto.paysNaissanceId)
                .orElseThrow(() -> new IllegalArgumentException("Pays introuvable"));

        Personnel instance = new Personnel();
        instance.fromDTO(dto, pays);

        Personnel created = service.create(instance);

        logger.info("[PersonnelController] personnel créé avec succès - ID: {}", created.getId());

        return ResponseEntity
                .created(URI.create("/api/personnels/" + created.getId()))
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
    public ResponseEntity<Personnel> update(
            @PathVariable String id,
            @RequestBody PersonnelDTO dto
    ) {

        logger.info("[PersonnelController] PUT /api/personnels/{} - Mise à jour", id);

        return service.get(id)
                .map(existing -> {

                    Pays pays = null;
                    if (dto.paysNaissanceId != null) {
                        pays = paysService.get(dto.paysNaissanceId)
                                .orElseThrow(() -> new IllegalArgumentException("Pays introuvable"));
                        existing.setPaysNaissance(pays);
                    }

                    existing.fromDTO(dto, null);

                    Personnel updated = service.update(id, existing);

                    logger.info("[PersonnelController] personnel {} mis à jour avec succès", id);

                    return ResponseEntity.ok(updated);
                })
                .orElseGet(() -> {
                    logger.warn("[PersonnelController] personnel {} introuvable", id);
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

        logger.info("[PersonnelController] DELETE /api/personnels/{} - Suppression", id);

        if (service.get(id).isEmpty()) {
            logger.warn("[PersonnelController] personnel {} introuvable", id);
            return ResponseEntity.notFound().build();
        }

        service.delete(id);

        logger.info("[PersonnelController] personnel {} supprimé avec succès", id);

        return ResponseEntity.noContent().build();
    }
}