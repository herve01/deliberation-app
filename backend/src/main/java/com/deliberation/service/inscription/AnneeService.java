package com.deliberation.service.inscription;

import com.deliberation.model.inscription.AnneeAcademique;
import com.deliberation.model.setting.User;
import com.deliberation.repository.inscription.AnneeRepository;
import com.deliberation.repository.setting.UserRepository;
import com.deliberation.service.IService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class AnneeService implements IService<AnneeAcademique, String> {
    private final AnneeRepository repository;

    public AnneeService(AnneeRepository repository) {
        this.repository = repository;
    }

    @Override
    public AnneeAcademique create(AnneeAcademique instance) {
        instance.setId(UUID.randomUUID().toString().replace("-", ""));
        return repository.save(instance);
    }

    @Override
    public AnneeAcademique update(String id, AnneeAcademique instance) {
        instance.setId(id);
        return repository.save(instance);
    }

    @Override
    public void delete(String id) {
        repository.deleteById(id);
    }

    @Override
    public Optional<AnneeAcademique> get(String id) {
        return repository.findById(id);
    }


    public Optional<AnneeAcademique> findByAnnee(String annee) {
        return repository.findByAnnee(annee);
    }

    @Override
    public List<AnneeAcademique> getAll() {
        return repository.findAll();
    }

    public AnneeAcademique getCurrentYear() {
        LocalDate today = LocalDate.now();
        return repository
                .findByDateOuvertureLessThanEqualAndDateClotureGreaterThanEqual(today, today)
                .orElse(null);
    }

    public AnneeAcademique getLastYear() {
        LocalDate today = LocalDate.now();
        return repository
                .findTopByDateClotureLessThanOrderByDateClotureDesc(today)
                .orElse(null);
    }

    public AnneeAcademique getNextYear() {
        LocalDate today = LocalDate.now();
        return repository
                .findTopByDateOuvertureGreaterThanOrderByDateOuvertureAsc(today)
                .orElse(null);
    }

    @Override
    public Long count() {
        return repository.count();
    }
}