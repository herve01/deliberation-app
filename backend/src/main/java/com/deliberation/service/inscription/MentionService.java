package com.deliberation.service.inscription;

import com.deliberation.model.inscription.Filiere;
import com.deliberation.model.inscription.Mention;
import com.deliberation.repository.inscription.FiliereRepository;
import com.deliberation.repository.inscription.MentionRepository;
import com.deliberation.repository.inscription.NiveauRepository;
import com.deliberation.service.IService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class MentionService implements IService<Mention, String> {

    private final MentionRepository repository;
    private final NiveauRepository niveauRepository;
    private final FiliereRepository filiereRepository;

    public MentionService(MentionRepository repository, NiveauRepository niveauRepository, FiliereRepository filiereRepository) {
        this.repository = repository;
        this.niveauRepository = niveauRepository;
        this.filiereRepository = filiereRepository;
    }

    @Override
    public Mention create(Mention instance) {
        instance.setId(UUID.randomUUID().toString().replace("-", ""));
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

    @Override
    public Long count() {
        return repository.count();
    }

    public List<Mention> getAll(String filiereId) {
        return repository.findByFiliereIdOrderByNiveauOrdreAsc(filiereId);
    }
}