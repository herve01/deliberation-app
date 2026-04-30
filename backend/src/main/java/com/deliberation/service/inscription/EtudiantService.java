package com.deliberation.service.inscription;

import com.deliberation.model.inscription.Domaine;
import com.deliberation.model.inscription.Etudiant;
import com.deliberation.repository.inscription.DomaineRepository;
import com.deliberation.repository.inscription.EtudiantRepository;
import com.deliberation.service.IService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class EtudiantService implements IService<Etudiant, String> {

    private final EtudiantRepository repository;

    public EtudiantService(EtudiantRepository repository) {
        this.repository = repository;
    }

    @Override
    public Etudiant create(Etudiant instance) {
        instance.setId(UUID.randomUUID().toString());
        return repository.save(instance);
    }

    @Override
    public Etudiant update(String id, Etudiant instance) {
        instance.setId(id);
        return repository.save(instance);
    }

    @Override
    public void delete(String id) {
        repository.deleteById(id);
    }

    @Override
    public Optional<Etudiant> get(String id) {
        return repository.findById(id);
    }

    @Override
    public List<Etudiant> getAll() {
        return repository.findAll();
    }
}