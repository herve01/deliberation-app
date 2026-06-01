package com.deliberation.service.deliberation;

import com.deliberation.model.deliberation.DeliberationDetail;
import com.deliberation.repository.deliberation.DeliberationDetailRepository;
import com.deliberation.service.IService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class DeliberationDetailService implements IService<DeliberationDetail, String> {

    private final DeliberationDetailRepository repository;

    public DeliberationDetailService(DeliberationDetailRepository repository) {
        this.repository = repository;
    }

    @Override
    public DeliberationDetail create(DeliberationDetail instance) {
        instance.setId(UUID.randomUUID().toString());
        return repository.save(instance);
    }

    @Override
    public DeliberationDetail update(String id, DeliberationDetail instance) {
        instance.setId(id);
        return repository.save(instance);
    }

    @Override
    public void delete(String id) {
        repository.deleteById(id);
    }

    @Override
    public Optional<DeliberationDetail> get(String id) {
        return repository.findById(id);
    }

    @Override
    public List<DeliberationDetail> getAll() {
        return repository.findAll();
    }

    @Override
    public Long count() {
        return repository.count();
    }
}