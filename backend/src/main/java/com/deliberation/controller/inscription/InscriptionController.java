package com.deliberation.controller.inscription;

import com.deliberation.dto.DashboardCardDTO;
import com.deliberation.dto.inscription.InscriptionDTO;
import com.deliberation.dto.inscription.response.InscriptionDashboardDTO;
import com.deliberation.dto.inscription.response.InscriptionRequestDTO;
import com.deliberation.model.enums.TypeMotif;
import com.deliberation.model.inscription.*;
import com.deliberation.model.setting.Pays;
import com.deliberation.service.cotation.MentionSemestreEcueDetailService;
import com.deliberation.service.cotation.MentionSemestreEcueService;
import com.deliberation.service.inscription.*;
import com.deliberation.service.setting.PaysService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import static org.springframework.data.jpa.domain.AbstractPersistable_.id;

@RestController
@RequestMapping("/api/inscriptions")
public class InscriptionController {

    private final InscriptionService service;
    private final AnneeService anneeService;
    private final MentionService mentionService;
    private final FiliereService filiereService;
    private final DomaineService domaineService;
    private final PaysService paysService;
    private final EtudiantService etudiantService;
    private final MentionSemestreEcueDetailService mentionSemestreEcueDetailService;
    private final MentionSemestreEcueService mentionSemestreEcueService;


    private static final Logger logger = LoggerFactory.getLogger(InscriptionController.class);

    public InscriptionController(InscriptionService service,
                                 AnneeService anneeService,
                                 MentionService mentionService, FiliereService filiereService, DomaineService domaineService,
                                 PaysService paysService,
                                 EtudiantService etudiantService, MentionSemestreEcueDetailService mentionSemestreEcueDetailService, MentionSemestreEcueService mentionSemestreEcueService) {
        this.service = service;
        this.anneeService = anneeService;
        this.mentionService = mentionService;
        this.filiereService = filiereService;
        this.domaineService = domaineService;
        this.paysService = paysService;
        this.etudiantService = etudiantService;
        this.mentionSemestreEcueDetailService = mentionSemestreEcueDetailService;
        this.mentionSemestreEcueService = mentionSemestreEcueService;
    }

    @GetMapping
    @Operation(summary = "Lister les inscriptions")
    public List<Inscription> all() {
        logger.info("[InscriptionController] GET /api/inscriptions");
        return service.getAll();
    }

    @GetMapping("/liste/{type}/{id}")
    @Operation(summary = "Lister les inscriptions")
    public List<Inscription> getByType(@PathVariable String id,  @PathVariable TypeMotif type) {
        logger.info("[InscriptionController] GET /api/inscriptions/{}/{}", type, id);

        return service.getAll(id, type);
    }

    @GetMapping("/etudiant/{etudiantId}/annee/{anneeId}")
    @Operation(summary = "Lister les inscriptions d'un étudiant par année")
    public List<Inscription> getInscriptionEtudiantByAnnee(
            @PathVariable String etudiantId,
            @PathVariable String anneeId) {

        logger.info("[InscriptionController] GET /api/inscriptions/etudiant/{}/annee/{}",
                etudiantId, anneeId);

        return service.getAll(etudiantId, anneeId);
    }

    @GetMapping("/annee/{anneeId}/mention/{mentionId}")
    @Operation(summary = "Lister les inscriptions d'un étudiant par année")
    public List<Inscription> getInscriptionMentionByAnnee(
            @PathVariable String anneeId,
            @PathVariable String mentionId) {

        logger.info("[InscriptionController] GET /api/inscriptions/annee/{}/mention/{}",
                anneeId, mentionId);

        return service.getAllBy(anneeId, mentionId);
    }

    @GetMapping("/etudiant/{etudiantId}/annee/{anneeId}/mention/{mentionId}")
    @Operation(summary = "Lister les inscriptions d'un étudiant par année")
    public ResponseEntity<Inscription> getInscriptionEtudiantAnneeByMention(
            @PathVariable String etudiantId,
            @PathVariable String anneeId,
            @PathVariable String mentionId
            ) {

        logger.info("[InscriptionController] GET /api/inscriptions/etudiant/{}/annee/{}/mention/{}",
                etudiantId, anneeId, mentionId);

        return service.get(etudiantId, anneeId, mentionId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtenir une inscription par ID")
    public ResponseEntity<Inscription> get(@PathVariable String id) {

        logger.info("[InscriptionController] GET /api/inscriptions/{}", id);

        return service.get(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Création simple (étudiant existant)
    @PostMapping
    @Operation(summary = "Créer une inscription")
    public ResponseEntity<Inscription> create(@RequestBody InscriptionDTO dto) {

        logger.info("[InscriptionController] Création inscription");

        Etudiant etudiant = etudiantService.get(dto.etudiantId)
                .orElseThrow(() -> new IllegalArgumentException("Étudiant introuvable"));

        AnneeAcademique annee = anneeService.get(dto.anneeId)
                .orElseThrow(() -> new IllegalArgumentException("Année introuvable"));

        Mention mention = mentionService.get(dto.mentionId)
                .orElseThrow(() -> new IllegalArgumentException("Mention introuvable"));

        Inscription instance = new Inscription();
        instance.fromDTO(dto, etudiant, annee, mention);

        Inscription created = service.create(instance);

        return ResponseEntity
                .created(URI.create("/api/inscriptions/" + created.getId()))
                .body(created);
    }

    // Création complète (nouvel étudiant + inscription)
    @PostMapping("/add_all")
    @Operation(summary = "Créer une inscription avec étudiant")
    public ResponseEntity<Inscription> createFull(@RequestBody InscriptionRequestDTO dto) {

        logger.info("[InscriptionController] Création complète inscription");

        Pays pays = paysService.get(dto.etudiant.paysNaissanceId)
                .orElseThrow(() -> new IllegalArgumentException("Pays introuvable"));

        Etudiant etudiant = new Etudiant();
        etudiant.fromDTO(dto.etudiant, pays);

        AnneeAcademique annee = anneeService.get(dto.inscription.anneeId)
                .orElseThrow(() -> new IllegalArgumentException("Année introuvable"));

        Mention mention = mentionService.get(dto.inscription.mentionId)
                .orElseThrow(() -> new IllegalArgumentException("Mention introuvable"));

        Inscription inscription = new Inscription();
        inscription.fromDTO(dto.inscription, null, annee, mention);

        Inscription saved = service.create(etudiant, inscription);

        return ResponseEntity
                .created(URI.create("/api/inscriptions/add_all" + saved.getId()))
                .body(saved);
    }

    @PostMapping("/annee/{anneeId}/mention/{mentionId}/add_all")
    @Operation(summary = "Créer plusieurs inscriptions avec étudiants")
    public ResponseEntity<List<Inscription>> createAll(
            @RequestBody List<InscriptionRequestDTO> dtos, @PathVariable String anneeId, @PathVariable String mentionId) {

        logger.info("[InscriptionController] Création multiple des inscriptions");
        // 3. Année académique
        AnneeAcademique annee = anneeService.get(anneeId)
                .orElseThrow(() -> new IllegalArgumentException("Année introuvable"));

        // 4. Mention
        Mention mention = mentionService.get(mentionId)
                .orElseThrow(() -> new IllegalArgumentException("Mention introuvable"));

        List<Inscription> inscriptions = dtos.stream().map(dto -> {

            // 1. Pays
            Pays pays = paysService.get(dto.etudiant.paysNaissanceId)
                    .orElseThrow(() -> new IllegalArgumentException("Pays introuvable"));

            // 2. Étudiant
            Etudiant etudiant = new Etudiant();
            etudiant.fromDTO(dto.etudiant, pays);

            // 5. Inscription
            Inscription inscription = new Inscription();
            inscription.fromDTO(dto.inscription, etudiant, annee, mention);
            return inscription;
        }).toList();

        // 6. Sauvegarde
        List<Inscription> saved = service.createAll(inscriptions);

        return ResponseEntity
                .created(URI.create("/api/inscriptions/annee/"+ anneeId + "/mention/" + mentionId + "/add_all")
                ).body(saved);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Mettre à jour une inscription")
    public ResponseEntity<Inscription> update(@PathVariable String id,
                                              @RequestBody InscriptionDTO dto) {

        return service.get(id)
                .map(existing -> {

                    if (dto.etudiantId != null) {
                        Etudiant etudiant = etudiantService.get(dto.etudiantId)
                                .orElseThrow(() -> new IllegalArgumentException("Étudiant introuvable"));
                        existing.setEtudiant(etudiant);
                    }

                    if (dto.anneeId != null) {
                        AnneeAcademique annee = anneeService.get(dto.anneeId)
                                .orElseThrow(() -> new IllegalArgumentException("Année introuvable"));
                        existing.setAnnee(annee);
                    }

                    existing.fromDTO(dto, null, null, null);

                    return ResponseEntity.ok(service.update(id, existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }


    @PutMapping("/update_all/{id}")
    @Operation(summary = "Mettre à jour une inscription")
    public ResponseEntity<Inscription> updateAll(@PathVariable String id, @RequestBody InscriptionRequestDTO dto) {
        return service.get(id)
            .map(existing -> {
                if (dto.etudiant != null) {
                    if (dto.etudiant.id != null) {

                        Etudiant etudiant = etudiantService.get(dto.etudiant.id)
                                .orElseThrow(() -> new IllegalArgumentException("Étudiant introuvable"));

                        existing.setEtudiant(etudiant);
                    }

                    if (dto.etudiant.paysNaissanceId != null) {

                        Pays pays = paysService.get(dto.etudiant.paysNaissanceId)
                                .orElseThrow(() -> new IllegalArgumentException("Pays introuvable"));

                        existing.getEtudiant().setPaysNaissance(pays);
                    }

                    // Mapping DTO -> Entity
                    existing.getEtudiant().fromDTO(dto.etudiant, null);
                }

                if (dto.inscription != null) {

                    if (dto.inscription.anneeId != null) {

                        AnneeAcademique annee = anneeService.get(dto.inscription.anneeId)
                                .orElseThrow(() -> new IllegalArgumentException("Année introuvable"));

                        existing.setAnnee(annee);
                    }

                    existing.fromDTO(dto.inscription, null, null, null);
                }

                // Sauvegarde
                Inscription updated = service.update(id, existing.getEtudiant(), existing);

                return ResponseEntity.ok(updated);

            })
            .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Supprimer une inscription")
    public ResponseEntity<Void> delete(@PathVariable String id) {

        if (service.get(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/annee/{anneeId}/dashboard")
    @Operation(summary = "Obtenir les statistiques du dashboard des inscriptions")
    public ResponseEntity<InscriptionDashboardDTO> getDashboard(@PathVariable String anneeId) {

        InscriptionDashboardDTO dto = new InscriptionDashboardDTO();

        var count = 0L;
        var objectif = 0L;

        count = mentionService.count();
        dto.mentions = new DashboardCardDTO(count, count);

        count = filiereService.count();
        dto.filieres = new DashboardCardDTO(count, count);

        count = domaineService.count();
        dto.domaines = new DashboardCardDTO(count, count);

        objectif = service.countPreviousYear();
        count = service.count(anneeId);
        dto.totalInscription = new DashboardCardDTO(count, objectif);

        objectif = etudiantService.countPreviousYearEtudiants();
        count = etudiantService.countThisYearEtudiants();
        dto.etudiants = new DashboardCardDTO(count, objectif);

        objectif = service.countPreviousDay(anneeId);
        count = service.countToday(anneeId);
        dto.toDay = new DashboardCardDTO(count, objectif);

        objectif = service.countPreviousMonth(anneeId);
        count = service.countThisMonth(anneeId);
        dto.currentMonth = new DashboardCardDTO(count, objectif);

        logger.info("[InscriptionController] GET /api/inscriptions/annee/{}/dashboard", anneeId);

        return ResponseEntity.ok(dto);
    }
}