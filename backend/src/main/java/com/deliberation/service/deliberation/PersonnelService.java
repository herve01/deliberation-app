package com.deliberation.service.deliberation;

import com.deliberation.model.deliberation.Personnel;
import com.deliberation.repository.deliberation.PersonnelRepository;
import com.deliberation.service.IService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class PersonnelService implements IService<Personnel, String> {

    private final PersonnelRepository repository;

    public PersonnelService(PersonnelRepository repository) {
        this.repository = repository;
    }

    @Override
    public Personnel create(Personnel instance) {
        instance.setId(UUID.randomUUID().toString().replace("-", ""));
        return repository.save(instance);
    }

    @Override
    public Personnel update(String id, Personnel instance) {
        instance.setId(id);
        return repository.save(instance);
    }

    @Override
    public void delete(String id) {
        repository.deleteById(id);
    }

    @Override
    public Optional<Personnel> get(String id) {
        return repository.findById(id);
    }

    @Override
    public List<Personnel> getAll() {
        return repository.findAll();
    }

    @Override
    public Long count() {
        return repository.count();
    }

}