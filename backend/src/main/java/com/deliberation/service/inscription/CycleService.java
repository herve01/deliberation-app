package com.deliberation.service.inscription;

import com.deliberation.model.inscription.Cycle;
import com.deliberation.repository.inscription.CycleRepository;
import com.deliberation.service.IService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class CycleService implements IService<Cycle, String> {

    private final CycleRepository repository;

    public CycleService(CycleRepository repository) {
        this.repository = repository;
    }

    @Override
    public Cycle create(Cycle instance) {
        instance.setId(UUID.randomUUID().toString().replace("-", ""));
        return repository.save(instance);
    }

    @Override
    public Cycle update(String id, Cycle instance) {
        instance.setId(id);
        return repository.save(instance);
    }

    @Override
    public void delete(String id) {
        repository.deleteById(id);
    }

    @Override
    public Optional<Cycle> get(String id) {
        return repository.findById(id);
    }

    @Override
    public List<Cycle> getAll() {
        return repository.findAllByOrderByOrdreAsc();
    }
}