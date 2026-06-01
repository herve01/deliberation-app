package com.deliberation.service.deliberation;

import com.deliberation.model.cotation.Cotation;
import com.deliberation.model.deliberation.Deliberation;
import com.deliberation.repository.deliberation.DeliberationDetailRepository;
import com.deliberation.repository.deliberation.DeliberationRepository;
import com.deliberation.service.IService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class DeliberationService implements IService<Deliberation, String> {

    private final DeliberationRepository repository;
    private final DeliberationDetailRepository detailRepository;

    public DeliberationService(DeliberationRepository repository, DeliberationDetailRepository detailRepository) {
        this.repository = repository;
        this.detailRepository = detailRepository;
    }

    @Override
    public Deliberation create(Deliberation instance) {
        instance.setId(UUID.randomUUID().toString());
        return repository.save(instance);
    }

    @Transactional
    public Deliberation createAll(Deliberation instance) {

        if(instance.getId().isEmpty())
            instance.setId(UUID.randomUUID().toString().replace("-", ""));

        var details = instance.getDetails();

        if (details != null && !details.isEmpty()) {
            details.forEach(detail -> {
                if(detail.getId().isEmpty())
                    detail.setId(UUID.randomUUID().toString().replace("-", ""));
            });
        }

        // Sauvegarde parent
        Deliberation saved = repository.save(instance);

        // Sauvegarde détails
        if (details != null && !details.isEmpty()) {
            detailRepository.saveAll(details);
        }

        return saved;
    }

    @Override
    public Deliberation update(String id, Deliberation instance) {
        instance.setId(id);
        return repository.save(instance);
    }

    @Override
    public void delete(String id) {
        repository.deleteById(id);
    }

    @Override
    public Optional<Deliberation> get(String id) {
        return repository.findById(id);
    }

    @Override
    public List<Deliberation> getAll() {
        return repository.findAll();
    }

    @Override
    public Long count() {
        return repository.count();
    }

}