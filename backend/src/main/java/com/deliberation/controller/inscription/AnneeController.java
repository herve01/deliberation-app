package com.deliberation.controller.inscription;

import com.deliberation.dto.inscription.AnneeAcademiqueDTO;
import com.deliberation.model.inscription.AnneeAcademique;
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
@RequestMapping("/api/annees")
public class AnneeController {

    private final AnneeService service;
    private static final Logger logger = LoggerFactory.getLogger(AnneeController.class);

    public AnneeController(AnneeService service) {
        this.service = service;
    }

    // =========================
    // GET ALL
    // =========================
    @GetMapping
    @Operation(
            summary = "Lister les années académiques",
            description = "Retourne la liste complète des années académiques disponibles dans le système"
    )
    public List<AnneeAcademique> all() {
        logger.info("[AnneeController] GET /api/annees");
        return service.getAll();
    }

    // =========================
    // GET BY ID
    // =========================
    @GetMapping("/{id}")
    @Operation(
            summary = "Obtenir une année académique par ID",
            description = "Retourne une année académique à partir de son identifiant unique"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Année trouvée"),
            @ApiResponse(responseCode = "404", description = "Année introuvable")
    })
    public ResponseEntity<AnneeAcademique> get(@PathVariable String id) {

        logger.info("[AnneeController] GET /api/annees/{}", id);

        return service.get(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // =========================
    // CREATE
    // =========================
    @PostMapping
    @Operation(
            summary = "Créer une année académique",
            description = "Crée une nouvelle année académique à partir des données fournies (ex: 2023-2024)"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Année créée avec succès"),
            @ApiResponse(responseCode = "400", description = "Données invalides")
    })
    public ResponseEntity<AnneeAcademique> create(@RequestBody AnneeAcademiqueDTO dto) {

        logger.info("[AnneeController] POST /api/annees");

        AnneeAcademique instance = new AnneeAcademique();
        instance.fromDTO(dto);

        AnneeAcademique created = service.create(instance);

        return ResponseEntity
                .created(URI.create("/api/annees/" + created.getId()))
                .body(created);
    }

    // =========================
    // UPDATE
    // =========================
    @PutMapping("/{id}")
    @Operation(
            summary = "Mettre à jour une année académique",
            description = "Met à jour les informations d'une année académique existante"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Année mise à jour"),
            @ApiResponse(responseCode = "404", description = "Année introuvable")
    })
    public ResponseEntity<AnneeAcademique> update(@PathVariable String id,
                                                  @RequestBody AnneeAcademiqueDTO dto) {

        logger.info("[AnneeController] PUT /api/annees/{}", id);

        return service.get(id)
                .map(existing -> {
                    existing.fromDTO(dto);
                    AnneeAcademique updated = service.update(id, existing);
                    return ResponseEntity.ok(updated);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // =========================
    // DELETE
    // =========================
    @DeleteMapping("/{id}")
    @Operation(
            summary = "Supprimer une année académique",
            description = "Supprime définitivement une année académique à partir de son identifiant"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Année supprimée"),
            @ApiResponse(responseCode = "404", description = "Année introuvable")
    })
    public ResponseEntity<Void> delete(@PathVariable String id) {

        logger.info("[AnneeController] DELETE /api/annees/{}", id);

        if (service.get(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    // =========================
    // SEARCH BY ANNEE
    // =========================
    @GetMapping("/search")
    @Operation(
            summary = "Rechercher une année académique par libellé",
            description = "Retourne une année académique à partir du champ année (ex: 2023-2024)"
    )
    public ResponseEntity<AnneeAcademique> getByAnnee(@RequestParam String annee) {

        logger.info("[AnneeController] SEARCH annee={}", annee);

        return service.findByAnnee(annee)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // =========================
    // CURRENT YEAR
    // =========================
    @GetMapping("/current")
    @Operation(
            summary = "Obtenir l'année académique en cours",
            description = "Retourne l'année académique active selon la date actuelle"
    )
    public ResponseEntity<AnneeAcademique> getCurrentYear() {

        AnneeAcademique current = service.getCurrentYear();

        if (current == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(current);
    }

    // =========================
    // LAST YEAR
    // =========================
    @GetMapping("/previous")
    @Operation(
            summary = "Obtenir la dernière année académique clôturée",
            description = "Retourne la dernière année académique dont la date de clôture est passée"
    )
    public ResponseEntity<AnneeAcademique> getLastYear() {

        AnneeAcademique last = service.getLastYear();

        if (last == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(last);
    }

    // =========================
    // NEXT YEAR
    // =========================
    @GetMapping("/next")
    @Operation(
            summary = "Obtenir la prochaine année académique",
            description = "Retourne la prochaine année académique dont la date d'ouverture est à venir"
    )
    public ResponseEntity<AnneeAcademique> getNextYear() {

        AnneeAcademique next = service.getNextYear();

        if (next == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(next);
    }
}