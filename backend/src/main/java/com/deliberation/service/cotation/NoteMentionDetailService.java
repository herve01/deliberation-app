package com.deliberation.service.cotation;

import com.deliberation.model.cotation.NoteMention;
import com.deliberation.model.cotation.NoteMentionDetail;
import com.deliberation.repository.cotation.NoteMentionDetailRepository;
import com.deliberation.repository.cotation.NoteMentionRepository;
import com.deliberation.service.IService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class NoteMentionDetailService implements IService<NoteMentionDetail, String> {

    private final NoteMentionDetailRepository repository;

    public NoteMentionDetailService(NoteMentionDetailRepository repository) {
        this.repository = repository;
    }

    @Override
    public NoteMentionDetail create(NoteMentionDetail instance) {
        instance.setId(UUID.randomUUID().toString().replace("-", ""));
        return repository.save(instance);
    }

    @Override
    public NoteMentionDetail update(String id, NoteMentionDetail instance) {
        instance.setId(id);
        return repository.save(instance);
    }

    @Override
    public void delete(String id) {
        repository.deleteById(id);
    }

    @Override
    public Optional<NoteMentionDetail> get(String id) {
        return repository.findById(id);
    }

    @Override
    public List<NoteMentionDetail> getAll() {
        return repository.findAll();
    }
}