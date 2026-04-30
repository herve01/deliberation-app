package com.deliberation.service.cotation;

import com.deliberation.model.cotation.Ecue;
import com.deliberation.model.cotation.MentionEcueDetail;
import com.deliberation.repository.cotation.EcueRepository;
import com.deliberation.repository.cotation.MentionEcueDetailRepository;
import com.deliberation.service.IService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class MentionEcueDetailService implements IService<MentionEcueDetail, String> {

    private final MentionEcueDetailRepository repository;

    public MentionEcueDetailService(MentionEcueDetailRepository repository) {
        this.repository = repository;
    }

    @Override
    public MentionEcueDetail create(MentionEcueDetail instance) {
        instance.setId(UUID.randomUUID().toString());
        return repository.save(instance);
    }

    @Override
    public MentionEcueDetail update(String id, MentionEcueDetail instance) {
        instance.setId(id);
        return repository.save(instance);
    }

    @Override
    public void delete(String id) {
        repository.deleteById(id);
    }

    @Override
    public Optional<MentionEcueDetail> get(String id) {
        return repository.findById(id);
    }

    @Override
    public List<MentionEcueDetail> getAll() {
        return repository.findAll();
    }
}