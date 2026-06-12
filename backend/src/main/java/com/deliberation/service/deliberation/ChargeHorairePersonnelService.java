package com.deliberation.service.deliberation;

import com.deliberation.model.deliberation.ChargeHorairePersonnel;
import com.deliberation.repository.deliberation.ChargeHorairePersonnelRepository;
import com.deliberation.service.IService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ChargeHorairePersonnelService implements IService<ChargeHorairePersonnel, String> {

    private final ChargeHorairePersonnelRepository repository;

    public ChargeHorairePersonnelService(ChargeHorairePersonnelRepository repository) {
        this.repository = repository;
    }

    @Override
    public ChargeHorairePersonnel create(ChargeHorairePersonnel instance) {
        instance.setId(UUID.randomUUID().toString().replace("-", ""));
        return repository.save(instance);
    }

    @Override
    public ChargeHorairePersonnel update(String id, ChargeHorairePersonnel instance) {
        instance.setId(id);
        return repository.save(instance);
    }

    @Override
    public void delete(String id) {
        repository.deleteById(id);
    }

    @Override
    public Optional<ChargeHorairePersonnel> get(String id) {
        return repository.findById(id);
    }

    @Override
    public List<ChargeHorairePersonnel> getAll() {
        return repository.findAll();
    }

    @Override
    public Long count() {
        return repository.count();
    }

}