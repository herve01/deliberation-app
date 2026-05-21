package com.deliberation.service.cotation;

import com.deliberation.model.cotation.MentionEcueDetail;
import com.deliberation.model.cotation.NoteMention;
import com.deliberation.repository.cotation.MentionEcueDetailRepository;
import com.deliberation.repository.cotation.NoteMentionRepository;
import com.deliberation.service.IService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class NoteMentionService implements IService<NoteMention, String> {

    private final NoteMentionRepository repository;

    public NoteMentionService(NoteMentionRepository repository) {
        this.repository = repository;
    }

    @Override
    public NoteMention create(NoteMention instance) {
        instance.setId(UUID.randomUUID().toString().replace("-", ""));
        return repository.save(instance);
    }

    @Override
    public NoteMention update(String id, NoteMention instance) {
        instance.setId(id);
        return repository.save(instance);
    }

    @Override
    public void delete(String id) {
        repository.deleteById(id);
    }

    @Override
    public Optional<NoteMention> get(String id) {
        return repository.findById(id);
    }

    @Override
    public List<NoteMention> getAll() {
        return repository.findAll();
    }
}