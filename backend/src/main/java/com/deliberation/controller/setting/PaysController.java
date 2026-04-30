package com.deliberation.controller.setting;

import com.deliberation.model.setting.Pays;
import com.deliberation.service.setting.PaysService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pays")
public class PaysController {

    private final PaysService service;
    private static final Logger logger = LoggerFactory.getLogger(PaysController.class);

    public PaysController(PaysService service) {
        this.service = service;
    }

    @GetMapping
    @Operation(
            summary = "Lister les pays",
            description = "Retourne la liste complète des pays"
    )
    @ApiResponse(responseCode = "200", description = "Liste récupérée avec succès")
    public List<Pays> all() {
        logger.info("[PaysController] GET /api/pays - Récupération de tous les pays");
        return service.getAll();
    }

    @GetMapping("/{id}")
    @Operation(
            summary = "Obtenir un pays par ID",
            description = "Retourne un pays à partir de son identifiant"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Pays trouvé"),
            @ApiResponse(responseCode = "404", description = "Pays introuvable")
    })
    public ResponseEntity<Pays> get(@PathVariable Integer id) {

        logger.info("[PaysController] GET /api/pays/{} - Récupération", id);

        return service.get(id)
            .map(pays -> {
                logger.info("[PaysController] Pays {} trouvé", id);
                return ResponseEntity.ok(pays);
            })
            .orElseGet(() -> {
                logger.warn("[PaysController] Pays {} introuvable", id);
                return ResponseEntity.notFound().build();
            });
    }
}