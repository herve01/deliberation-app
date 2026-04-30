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

    public FiliereService(FiliereRepository repository) {
        this.repository = repository;
    }

    @Override
    public Filiere create(Filiere instance) {
        instance.setId(UUID.randomUUID().toString());
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
}