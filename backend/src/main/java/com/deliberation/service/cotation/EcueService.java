package com.deliberation.service.cotation;

import com.deliberation.model.cotation.Ecue;
import com.deliberation.repository.cotation.EcueRepository;
import com.deliberation.service.IService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class EcueService implements IService<Ecue, String> {

    private final EcueRepository repository;

    public EcueService(EcueRepository repository) {
        this.repository = repository;
    }

    @Override
    public Ecue create(Ecue instance) {
        instance.setId(UUID.randomUUID().toString().replace("-", ""));
        return repository.save(instance);
    }

    @Override
    public Ecue update(String id, Ecue instance) {
        instance.setId(id);
        return repository.save(instance);
    }

    @Override
    public void delete(String id) {
        repository.deleteById(id);
    }

    @Override
    public Optional<Ecue> get(String id) {
        return repository.findById(id);
    }

    @Override
    public List<Ecue> getAll() {
        return repository.findAll();
    }
}