package com.deliberation.service.cotation;

import com.deliberation.model.cotation.Categorie;
import com.deliberation.model.cotation.Categorie;
import com.deliberation.repository.cotation.CategorieRepository;
import com.deliberation.service.IService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class CategorieService implements IService<Categorie, String> {

    private final CategorieRepository repository;

    public CategorieService(CategorieRepository repository) {
        this.repository = repository;
    }

    @Override
    public Categorie create(Categorie instance) {
        instance.setId(UUID.randomUUID().toString().replace("-", ""));
        return repository.save(instance);
    }

    @Override
    public Categorie update(String id, Categorie instance) {
        instance.setId(id);
        return repository.save(instance);
    }

    @Override
    public void delete(String id) {
        repository.deleteById(id);
    }

    @Override
    public Optional<Categorie> get(String id) {
        return repository.findById(id);
    }

    @Override
    public List<Categorie> getAll() {
        return repository.findAll();
    }

    @Override
    public Long count() {
        return repository.count();
    }
}