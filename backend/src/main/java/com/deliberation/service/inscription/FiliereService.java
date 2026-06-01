package com.deliberation.service.inscription;

import com.deliberation.model.inscription.Domaine;
import com.deliberation.model.inscription.Filiere;
import com.deliberation.repository.inscription.DomaineRepository;
import com.deliberation.repository.inscription.FiliereRepository;
import com.deliberation.service.IService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class FiliereService implements IService<Filiere, String> {

    private final FiliereRepository repository;
    private final DomaineRepository domaineRepository;

    public FiliereService(FiliereRepository repository, DomaineRepository domaineRepository) {
        this.repository = repository;
        this.domaineRepository = domaineRepository;
    }

    @Override
    public Filiere create(Filiere instance) {
        instance.setId(UUID.randomUUID().toString().replace("-", ""));
        return repository.save(instance);
    }

    @Override
    public Filiere update(String id, Filiere instance) {
        instance.setId(id);
        return repository.save(instance);
    }

    @Override
    public void delete(String id) {
        repository.deleteById(id);
    }

    @Override
    public Optional<Filiere> get(String id) {
        return repository.findById(id);
    }

    @Override
    public List<Filiere> getAll() {
        return repository.findAll();
    }

    @Override
    public Long count() {
        return repository.count();
    }

    public List<Filiere> getAll(Boolean withDomaine) {
        return repository.findAll()
                .stream()
                .map(row -> mapping(row, withDomaine))
                .toList();
    }

    private Filiere mapping(Filiere row, Boolean withDomaine) {

        if (Boolean.TRUE.equals(withDomaine)
                && row.getDomaine() != null
                && row.getDomaine().getId() != null) {

            row.setDomaine(
                    domaineRepository.findById(row.getDomaine().getId())
                            .orElse(null)
            );
        }

        return row;
    }

    public List<Filiere> getAll(String domaineId) {
        return repository.findByDomaineId(domaineId);
    }

    /*
        public List<Filiere> getAll() {
        return repository.findAll()
                .stream()
                .map(this::map)
                .toList();
    }
     */
}