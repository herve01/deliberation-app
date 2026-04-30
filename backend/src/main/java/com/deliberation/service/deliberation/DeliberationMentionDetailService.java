package com.deliberation.service.deliberation;

import com.deliberation.model.deliberation.DeliberationMention;
import com.deliberation.model.deliberation.DeliberationMentionDetail;
import com.deliberation.repository.deliberation.DeliberationMentionDetailRepository;
import com.deliberation.repository.deliberation.DeliberationMentionRepository;
import com.deliberation.service.IService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class DeliberationMentionDetailService implements IService<DeliberationMentionDetail, String> {

    private final DeliberationMentionDetailRepository repository;

    public DeliberationMentionDetailService(DeliberationMentionDetailRepository repository) {
        this.repository = repository;
    }

    @Override
    public DeliberationMentionDetail create(DeliberationMentionDetail instance) {
        instance.setId(UUID.randomUUID().toString());
        return repository.save(instance);
    }

    @Override
    public DeliberationMentionDetail update(String id, DeliberationMentionDetail instance) {
        instance.setId(id);
        return repository.save(instance);
    }

    @Override
    public void delete(String id) {
        repository.deleteById(id);
    }

    @Override
    public Optional<DeliberationMentionDetail> get(String id) {
        return repository.findById(id);
    }

    @Override
    public List<DeliberationMentionDetail> getAll() {
        return repository.findAll();
    }
}