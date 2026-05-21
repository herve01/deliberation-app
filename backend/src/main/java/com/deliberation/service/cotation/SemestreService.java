package com.deliberation.service.cotation;

import com.deliberation.model.cotation.Semestre;
import com.deliberation.model.inscription.Domaine;
import com.deliberation.repository.cotation.SemestreRepository;
import com.deliberation.repository.inscription.DomaineRepository;
import com.deliberation.service.IService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class SemestreService implements IService<Semestre, String> {

    private final SemestreRepository repository;

    public SemestreService(SemestreRepository repository) {
        this.repository = repository;
    }

    @Override
    public Semestre create(Semestre instance) {
        instance.setId(UUID.randomUUID().toString().replace("-", ""));
        return repository.save(instance);
    }

    @Override
    public Semestre update(String id, Semestre instance) {
        instance.setId(id);
        return repository.save(instance);
    }

    @Override
    public void delete(String id) {
        repository.deleteById(id);
    }

    @Override
    public Optional<Semestre> get(String id) {
        return repository.findById(id);
    }

    @Override
    public List<Semestre> getAll() {
        return repository.findAll();
    }
}