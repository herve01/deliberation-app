package com.deliberation.service.inscription;

import com.deliberation.model.inscription.Niveau;
import com.deliberation.repository.inscription.NiveauRepository;
import com.deliberation.service.IService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class NiveauService implements IService<Niveau, String> {
    private final NiveauRepository repository;

    public NiveauService(NiveauRepository repository) {
        this.repository = repository;
    }

    @Override
    public Niveau create(Niveau instance) {
        instance.setId(UUID.randomUUID().toString());
        return repository.save(instance);
    }

    @Override
    public Niveau update(String id, Niveau instance) {
        instance.setId(id);
        return repository.save(instance);
    }

    @Override
    public void delete(String id) {
        repository.deleteById(id);
    }

    @Override
    public Optional<Niveau> get(String id) {
        return repository.findById(id);
    }

    @Override
    public List<Niveau> getAll() {
        return repository.findAllByOrderByIsOldSystemAscOrdreAsc();
    }

    public List<Niveau> getAll(Boolean isOldSystem) {
        return repository.findAllByIsOldSystemOrderByOrdreAsc(isOldSystem);
    }
}