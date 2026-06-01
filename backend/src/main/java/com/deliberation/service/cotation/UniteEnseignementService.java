package com.deliberation.service.cotation;

import com.deliberation.model.cotation.Ecue;
import com.deliberation.model.cotation.UniteEnseignement;
import com.deliberation.repository.cotation.EcueRepository;
import com.deliberation.repository.cotation.UniteEnseignementRepository;
import com.deliberation.service.IService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UniteEnseignementService implements IService<UniteEnseignement, String> {

    private final UniteEnseignementRepository repository;

    public UniteEnseignementService(UniteEnseignementRepository repository) {
        this.repository = repository;
    }

    @Override
    public UniteEnseignement create(UniteEnseignement instance) {
        instance.setId(UUID.randomUUID().toString().replace("-", ""));
        return repository.save(instance);
    }

    @Override
    public UniteEnseignement update(String id, UniteEnseignement instance) {
        instance.setId(id);
        return repository.save(instance);
    }

    @Override
    public void delete(String id) {
        repository.deleteById(id);
    }

    @Override
    public Optional<UniteEnseignement> get(String id) {
        return repository.findById(id);
    }

    @Override
    public List<UniteEnseignement> getAll() {
        return repository.findAll();
    }

    @Override
    public Long count() {
        return repository.count();
    }

}