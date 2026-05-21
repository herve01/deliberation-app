package com.deliberation.service.inscription;

import com.deliberation.model.enums.TypeMotif;
import com.deliberation.model.inscription.Etudiant;
import com.deliberation.model.inscription.Inscription;
import com.deliberation.repository.inscription.EtudiantRepository;
import com.deliberation.repository.inscription.InscriptionRepository;
import com.deliberation.service.IService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class InscriptionService implements IService<Inscription, String> {
    private final InscriptionRepository repository;
    private final EtudiantRepository etudiantRepository;

    public InscriptionService(InscriptionRepository repository, EtudiantRepository etudiantRepository) {
        this.repository = repository;
        this.etudiantRepository = etudiantRepository;
    }

    @Override
    public Inscription create(Inscription instance) {
        instance.setId(UUID.randomUUID().toString().replace("-", ""));
        return repository.save(instance);
    }


    @Transactional
    public List<Inscription> createAll(List<Inscription> instances) {

        instances.forEach(instance -> {
            // Préparer étudiant
            Etudiant etudiant = instance.getEtudiant();

            etudiant.setId(UUID.randomUUID().toString().replace("-", ""));
            etudiant.setCreatedAt(LocalDateTime.now());
            Etudiant savedEtudiant = etudiantRepository.save(etudiant);

            // Préparer inscription
            instance.setId(UUID.randomUUID().toString().replace("-", ""));
            instance.setCreatedAt(LocalDateTime.now());
            instance.setDate(LocalDateTime.now());
            instance.setEtudiant(savedEtudiant);
        });

        // Sauvegarder toutes les inscriptions
        return repository.saveAll(instances);
    }

    @Transactional
    public Inscription create(Etudiant etudiant, Inscription inscription) {

        // 1. créer étudiant
        etudiant.setId(UUID.randomUUID().toString().replace("-", ""));
        etudiant.setCreatedAt(LocalDateTime.now());

        Etudiant savedEtudiant = etudiantRepository.save(etudiant);

        // 2. créer inscription
        inscription.setId(UUID.randomUUID().toString().replace("-", ""));
        inscription.setEtudiant(savedEtudiant);
        inscription.setDate(LocalDateTime.now());

        return repository.save(inscription);
    }

    @Override
    public Inscription update(String id, Inscription instance) {
        instance.setId(id);
        return repository.save(instance);
    }

    @Transactional
    public Inscription update(String inscriptionId, Etudiant etudiant, Inscription inscription) {

        // 1. récupérer l'inscription existante
        Inscription existingInscription = repository.findById(inscriptionId)
                .orElseThrow(() -> new RuntimeException("Inscription introuvable"));

        // 2. récupérer l'étudiant existant
        Etudiant existingEtudiant = etudiantRepository.findById(existingInscription.getEtudiant().getId())
                .orElseThrow(() -> new RuntimeException("Etudiant introuvable"));

        // 3. mettre à jour les champs de l'étudiant
        existingEtudiant.setNom(etudiant.getNom());
        existingEtudiant.setPostnom(etudiant.getPostnom());
        existingEtudiant.setPrenom(etudiant.getPrenom());
        // ajoute ici les autres champs nécessaires

        Etudiant updatedEtudiant = etudiantRepository.save(existingEtudiant);

        // 4. mettre à jour les champs de l'inscription
        existingInscription.setEtudiant(updatedEtudiant);
        existingInscription.setAnnee(inscription.getAnnee());
        existingInscription.setMention(inscription.getMention());

        return repository.save(existingInscription);
    }

    @Override
    public void delete(String id) {
        repository.deleteById(id);
    }

    @Override
    public Optional<Inscription> get(String id) {
        return repository.findById(id);
    }

    @Override
    public List<Inscription> getAll() {
        return repository.findAll();
    }


    public List<Inscription> getAll(String id, TypeMotif type) {
        if( type == TypeMotif.ETUDIANT)
            return repository.findAllByEtudiant_Id(id);
        else if (type == TypeMotif.ANNEE) {
            return repository.findAllByAnnee_Id(id);
        }

        return repository.findAllByMention_Id(id);
    }

    public List<Inscription> getAll(String etudiantId, String anneeId) {
        return repository
                .findAllByEtudiant_IdAndAnnee_Id(etudiantId, anneeId);
    }

    public List<Inscription> getAllBy(String anneeId, String mentionId) {
        return repository
                .findAllByAnnee_IdAndMention_Id(anneeId, mentionId);
    }

    public Optional<Inscription> get(String etudiantId, String anneeId, String mentionId) {
        return repository
                .findOneByEtudiant_IdAndAnnee_IdAndMention_Id(
                        etudiantId, anneeId, mentionId
                );
    }
}