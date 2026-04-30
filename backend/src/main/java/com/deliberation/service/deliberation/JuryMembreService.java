package com.deliberation.service.deliberation;

import com.deliberation.model.cotation.NoteMentionDetail;
import com.deliberation.model.deliberation.JuryMembre;
import com.deliberation.repository.cotation.NoteMentionDetailRepository;
import com.deliberation.repository.deliberation.JuryMembreRepository;
import com.deliberation.service.IService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class JuryMembreService implements IService<JuryMembre, String> {

    private final JuryMembreRepository repository;

    public JuryMembreService(JuryMembreRepository repository) {
        this.repository = repository;
    }

    @Override
    public JuryMembre create(JuryMembre instance) {
        instance.setId(UUID.randomUUID().toString());
        return repository.save(instance);
    }

    @Override
    public JuryMembre update(String id, JuryMembre instance) {
        instance.setId(id);
        return repository.save(instance);
    }

    @Override
    public void delete(String id) {
        repository.deleteById(id);
    }

    @Override
    public Optional<JuryMembre> get(String id) {
        return repository.findById(id);
    }

    @Override
    public List<JuryMembre> getAll() {
        return repository.findAll();
    }
}