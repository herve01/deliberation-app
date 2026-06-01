package com.deliberation.controller.cotation;

import com.deliberation.dto.cotation.CategorieDTO;
import com.deliberation.model.cotation.Semestre;
import com.deliberation.model.cotation.Categorie;
import com.deliberation.service.cotation.SemestreService;
import com.deliberation.service.cotation.CategorieService;
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
@RequestMapping("/api/categories")
public class CategorieController {

    private final CategorieService service;

    private static final Logger logger = LoggerFactory.getLogger(CategorieController.class);

    public CategorieController(CategorieService service) {
        this.service = service;
    }

    @GetMapping
    @Operation(
            summary = "Lister les categories",
            description = "Retourne la liste complète des categories"
    )
    @ApiResponse(responseCode = "200", description = "Liste récupérée avec succès")
    public List<Categorie> all() {
        logger.info("[CategorieController] GET /api/categories - Récupération de toutes les categories");
        return service.getAll();
    }
    
    @GetMapping("/{id}")
    @Operation(
            summary = "Obtenir une Categorie par ID",
            description = "Retourne une Categorie à partir de son identifiant"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Categorie trouvée"),
            @ApiResponse(responseCode = "404", description = "Categorie introuvable")
    })
    public ResponseEntity<Categorie> get(@PathVariable String id) {

        logger.info("[CategorieController] GET /api/categories/{} - Récupération", id);

        return service.get(id)
                .map(Categorie -> {
                    logger.info("[CategorieController] Categorie {} trouvée", id);
                    return ResponseEntity.ok(Categorie);
                })
                .orElseGet(() -> {
                    logger.warn("[CategorieController] Categorie {} introuvable", id);
                    return ResponseEntity.notFound().build();
                });
    }

    @PostMapping
    @Operation(
            summary = "Créer une Categorie",
            description = "Crée une nouvelle Categorie liée à un semestre"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Categorie créée"),
            @ApiResponse(responseCode = "400", description = "Requête invalide")
    })
    public ResponseEntity<Categorie> create(@RequestBody CategorieDTO dto) {

        logger.info("[CategorieController] POST /api/categories - Création d'une Categorie");

        Categorie instance = new Categorie();
        instance.fromDTO(dto);

        Categorie created = service.create(instance);

        logger.info("[CategorieController] Categorie créée avec succès - ID: {}", created.getId());

        return ResponseEntity
                .created(URI.create("/api/categories/" + created.getId()))
                .body(created);
    }

    @PutMapping("/{id}")
    @Operation(
            summary = "Mettre à jour une Categorie",
            description = "Met à jour une Categorie existante"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Categorie mise à jour"),
            @ApiResponse(responseCode = "404", description = "Categorie introuvable")
    })
    public ResponseEntity<Categorie> update(@PathVariable String id,
                                          @RequestBody CategorieDTO dto) {

        logger.info("[CategorieController] PUT /api/categories/{} - Mise à jour", id);

        return service.get(id)
                .map(existing -> {

                    existing.fromDTO(dto);

                    Categorie updated = service.update(id, existing);

                    logger.info("[CategorieController] Categorie {} mise à jour avec succès", id);

                    return ResponseEntity.ok(updated);
                })
                .orElseGet(() -> {
                    logger.warn("[CategorieController] Categorie {} introuvable", id);
                    return ResponseEntity.notFound().build();
                });
    }

    @DeleteMapping("/{id}")
    @Operation(
            summary = "Supprimer une Categorie",
            description = "Supprime une Categorie"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Categorie supprimée"),
            @ApiResponse(responseCode = "404", description = "Categorie introuvable")
    })
    public ResponseEntity<Void> delete(@PathVariable String id) {

        logger.info("[CategorieController] DELETE /api/categories/{} - Suppression", id);

        if (service.get(id).isEmpty()) {
            logger.warn("[CategorieController] Categorie {} introuvable", id);
            return ResponseEntity.notFound().build();
        }

        service.delete(id);

        logger.info("[CategorieController] Categorie {} supprimée avec succès", id);

        return ResponseEntity.noContent().build();
    }
}