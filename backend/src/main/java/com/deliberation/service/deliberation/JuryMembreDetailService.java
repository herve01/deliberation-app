package com.deliberation.service.deliberation;

import com.deliberation.model.deliberation.JuryMembreDetail;
import com.deliberation.repository.deliberation.JuryMembreDetailRepository;
import com.deliberation.service.IService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class JuryMembreDetailService implements IService<JuryMembreDetail, String> {

    private final JuryMembreDetailRepository repository;

    public JuryMembreDetailService(JuryMembreDetailRepository repository) {
        this.repository = repository;
    }

    @Override
    public JuryMembreDetail create(JuryMembreDetail instance) {
        instance.setId(UUID.randomUUID().toString().replace("-", ""));
        return repository.save(instance);
    }

    public List<JuryMembreDetail> createAll(List<JuryMembreDetail> instances) {

        if (instances != null && !instances.isEmpty()) {
            instances.forEach(instance -> {
                if(instance.getId().isEmpty())
                    instance.setId(UUID.randomUUID().toString().replace("-", ""));
            });
        }
        return repository.saveAll(instances);
    }

    @Override
    public JuryMembreDetail update(String id, JuryMembreDetail instance) {
        instance.setId(id);
        return repository.save(instance);
    }

    @Override
    public void delete(String id) {
        repository.deleteById(id);
    }

    @Override
    public Optional<JuryMembreDetail> get(String id) {
        return repository.findById(id);
    }

    @Override
    public List<JuryMembreDetail> getAll() {
        return repository.findAll();
    }

    public List<JuryMembreDetail> getAll(String anneeId, String mentionId) {
        return repository.findByAnneeIdAndMentionId(anneeId, mentionId);
    }

    @Override
    public Long count() {
        return repository.count();
    }

}