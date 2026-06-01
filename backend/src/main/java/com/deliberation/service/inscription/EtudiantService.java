package com.deliberation.service.inscription;

import com.deliberation.model.inscription.Domaine;
import com.deliberation.model.inscription.Etudiant;
import com.deliberation.repository.inscription.DomaineRepository;
import com.deliberation.repository.inscription.EtudiantRepository;
import com.deliberation.service.IService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class EtudiantService implements IService<Etudiant, String> {

    private final EtudiantRepository repository;

    public EtudiantService(EtudiantRepository repository) {
        this.repository = repository;
    }

    @Override
    public Etudiant create(Etudiant instance) {
        instance.setId(UUID.randomUUID().toString().replace("-", ""));
        return repository.save(instance);
    }

    @Override
    public Etudiant update(String id, Etudiant instance) {
        instance.setId(id);
        return repository.save(instance);
    }

    @Override
    public void delete(String id) {
        repository.deleteById(id);
    }

    @Override
    public Optional<Etudiant> get(String id) {
        return repository.findById(id);
    }

    @Override
    public List<Etudiant> getAll() {
        return repository.findAll();
    }

    @Override
    public Long count() {
        return repository.count();
    }

    public long countPreviousYearEtudiants() {

        LocalDateTime debut = LocalDate.now()
                .minusYears(1)
                .withDayOfYear(1)
                .atStartOfDay();

        LocalDateTime fin = debut.plusYears(1);

        return repository.countBetween(debut, fin);
    }

    public long countThisYearEtudiants() {

        LocalDateTime debut = LocalDate.now()
                .withDayOfYear(1)
                .atStartOfDay();

        LocalDateTime fin = debut.plusYears(1);

        return repository.countBetween(debut, fin);
    }
}