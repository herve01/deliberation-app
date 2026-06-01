package com.deliberation.service.deliberation;

import com.deliberation.model.deliberation.EtudiantEcueTransfert;
import com.deliberation.repository.deliberation.EtudiantEcueTransfertRepository;
import com.deliberation.repository.deliberation.PersonnelRepository;
import com.deliberation.service.IService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class EtudiantEcueTransfertService implements IService<EtudiantEcueTransfert, String> {

    private final EtudiantEcueTransfertRepository repository;

    public EtudiantEcueTransfertService(EtudiantEcueTransfertRepository repository) {
        this.repository = repository;
    }

    @Override
    public EtudiantEcueTransfert create(EtudiantEcueTransfert instance) {
        instance.setId(UUID.randomUUID().toString());
        return repository.save(instance);
    }

    @Override
    public EtudiantEcueTransfert update(String id, EtudiantEcueTransfert instance) {
        instance.setId(id);
        return repository.save(instance);
    }

    @Override
    public void delete(String id) {
        repository.deleteById(id);
    }

    @Override
    public Optional<EtudiantEcueTransfert> get(String id) {
        return repository.findById(id);
    }

    @Override
    public List<EtudiantEcueTransfert> getAll() {
        return repository.findAll();
    }

    @Override
    public Long count() {
        return repository.count();
    }

}