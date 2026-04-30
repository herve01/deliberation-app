package com.deliberation.service.inscription;

import com.deliberation.model.inscription.Filiere;
import com.deliberation.model.inscription.Mention;
import com.deliberation.repository.inscription.FiliereRepository;
import com.deliberation.repository.inscription.MentionRepository;
import com.deliberation.service.IService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class MentionService implements IService<Mention, String> {

    private final MentionRepository repository;

    public MentionService(MentionRepository repository) {
        this.repository = repository;
    }

    @Override
    public Mention create(Mention instance) {
        instance.setId(UUID.randomUUID().toString());
        return repository.save(instance);
    }

    @Override
    public Mention update(String id, Mention instance) {
        instance.setId(id);
        return repository.save(instance);
    }

    @Override
    public void delete(String id) {
        repository.deleteById(id);
    }

    @Override
    public Optional<Mention> get(String id) {
        return repository.findById(id);
    }

    @Override
    public List<Mention> getAll() {
        return repository.findAll();
    }
}