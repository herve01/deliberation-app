package com.deliberation.service.deliberation;

import com.deliberation.model.deliberation.DeliberationMention;
import com.deliberation.model.deliberation.MentionJuryMembreDetail;
import com.deliberation.repository.deliberation.DeliberationMentionRepository;
import com.deliberation.repository.deliberation.MentionJuryMembreDetailRepository;
import com.deliberation.service.IService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class DeliberationMentionService implements IService<DeliberationMention, String> {

    private final DeliberationMentionRepository repository;

    public DeliberationMentionService(DeliberationMentionRepository repository) {
        this.repository = repository;
    }

    @Override
    public DeliberationMention create(DeliberationMention instance) {
        instance.setId(UUID.randomUUID().toString());
        return repository.save(instance);
    }

    @Override
    public DeliberationMention update(String id, DeliberationMention instance) {
        instance.setId(id);
        return repository.save(instance);
    }

    @Override
    public void delete(String id) {
        repository.deleteById(id);
    }

    @Override
    public Optional<DeliberationMention> get(String id) {
        return repository.findById(id);
    }

    @Override
    public List<DeliberationMention> getAll() {
        return repository.findAll();
    }
}