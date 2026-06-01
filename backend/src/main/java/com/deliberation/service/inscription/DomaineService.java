package com.deliberation.service.inscription;

import com.deliberation.model.inscription.Domaine;
import com.deliberation.model.inscription.Niveau;
import com.deliberation.repository.inscription.DomaineRepository;
import com.deliberation.repository.inscription.NiveauRepository;
import com.deliberation.service.IService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class DomaineService implements IService<Domaine, String> {

    private final DomaineRepository repository;

    public DomaineService(DomaineRepository repository) {
        this.repository = repository;
    }

    @Override
    public Domaine create(Domaine instance) {
        instance.setId(UUID.randomUUID().toString().replace("-", ""));
        return repository.save(instance);
    }

    @Override
    public Domaine update(String id, Domaine instance) {
        instance.setId(id);
        return repository.save(instance);
    }

    @Override
    public void delete(String id) {
        repository.deleteById(id);
    }

    @Override
    public Optional<Domaine> get(String id) {
        return repository.findById(id);
    }

    @Override
    public List<Domaine> getAll() {
        return repository.findAll();
    }

    @Override
    public Long count() {
        return repository.count();
    }
}