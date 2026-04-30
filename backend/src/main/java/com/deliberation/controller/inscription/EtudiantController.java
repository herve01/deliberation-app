package com.deliberation.controller.inscription;

import com.deliberation.dto.inscription.EtudiantDTO;
import com.deliberation.model.inscription.Etudiant;
import com.deliberation.model.setting.Pays;
import com.deliberation.service.inscription.EtudiantService;
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
@RequestMapping("/api/etudiants")
public class EtudiantController {

    private final EtudiantService service;
    private final PaysService paysService;
    private static final Logger logger = LoggerFactory.getLogger(EtudiantController.class);

    public EtudiantController(EtudiantService service, PaysService paysService) {
        this.service = service;
        this.paysService = paysService;
    }

    @GetMapping
    @Operation(
            summary = "Lister les étudiants",
            description = "Retourne la liste complète des étudiants"
    )
    @ApiResponse(responseCode = "200", description = "Liste récupérée avec succès")
    public List<Etudiant> all() {
        logger.info("[EtudiantController] GET /api/etudiants - Récupération de tous les étudiants");
        return service.getAll();
    }

    @GetMapping("/{id}")
    @Operation(
            summary = "Obtenir un étudiant par ID",
            description = "Retourne un étudiant à partir de son identifiant"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Étudiant trouvé"),
            @ApiResponse(responseCode = "404", description = "Étudiant introuvable")
    })
    public ResponseEntity<Etudiant> get(@PathVariable String id) {

        logger.info("[EtudiantController] GET /api/etudiants/{} - Récupération", id);

        return service.get(id)
                .map(etudiant -> {
                    logger.info("[EtudiantController] Étudiant {} trouvé", id);
                    return ResponseEntity.ok(etudiant);
                })
                .orElseGet(() -> {
                    logger.warn("[EtudiantController] Étudiant {} introuvable", id);
                    return ResponseEntity.notFound().build();
                });
    }

    @PostMapping
    @Operation(
            summary = "Créer un étudiant",
            description = "Crée un nouvel étudiant"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Étudiant créé"),
            @ApiResponse(responseCode = "400", description = "Requête invalide")
    })
    public ResponseEntity<Etudiant> create(@RequestBody EtudiantDTO dto) {

        logger.info("[EtudiantController] POST /api/etudiants - Création d'un étudiant");

        Pays pays = paysService.get(dto.paysNaissanceId)
                .orElseThrow(() -> new IllegalArgumentException("Pays introuvable"));

        Etudiant instance = new Etudiant();
        instance.fromDTO(dto, pays);

        Etudiant created = service.create(instance);

        logger.info("[EtudiantController] Étudiant créé avec succès - ID: {}", created.getId());

        return ResponseEntity
                .created(URI.create("/api/etudiants/" + created.getId()))
                .body(created);
    }

    @PutMapping("/{id}")
    @Operation(
            summary = "Mettre à jour un étudiant",
            description = "Met à jour un étudiant existant"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Étudiant mis à jour"),
            @ApiResponse(responseCode = "404", description = "Étudiant introuvable")
    })
    public ResponseEntity<Etudiant> update(@PathVariable String id,
                                           @RequestBody EtudiantDTO dto) {

        logger.info("[EtudiantController] PUT /api/etudiants/{} - Mise à jour", id);

        return service.get(id)
                .map(existing -> {

                    if (dto.paysNaissanceId != null) {
                        Pays pays = paysService.get(dto.paysNaissanceId)
                                .orElseThrow(() -> new IllegalArgumentException("Pays introuvable"));
                        existing.setPaysNaissance(pays);
                    }

                    existing.fromDTO(dto, null);

                    Etudiant updated = service.update(id, existing);

                    logger.info("[EtudiantController] Étudiant {} mis à jour avec succès", id);

                    return ResponseEntity.ok(updated);
                })
                .orElseGet(() -> {
                    logger.warn("[EtudiantController] Étudiant {} introuvable", id);
                    return ResponseEntity.notFound().build();
                });
    }

    @DeleteMapping("/{id}")
    @Operation(
            summary = "Supprimer un étudiant",
            description = "Supprime un étudiant"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Étudiant supprimé"),
            @ApiResponse(responseCode = "404", description = "Étudiant introuvable")
    })
    public ResponseEntity<Void> delete(@PathVariable String id) {

        logger.info("[EtudiantController] DELETE /api/etudiants/{} - Suppression", id);

        if (service.get(id).isEmpty()) {
            logger.warn("[EtudiantController] Étudiant {} introuvable", id);
            return ResponseEntity.notFound().build();
        }

        service.delete(id);

        logger.info("[EtudiantController] Étudiant {} supprimé avec succès", id);

        return ResponseEntity.noContent().build();
    }
}