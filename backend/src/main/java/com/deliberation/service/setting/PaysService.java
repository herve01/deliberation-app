package com.deliberation.service.setting;

import com.deliberation.model.setting.Pays;
import com.deliberation.repository.setting.PaysRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PaysService {
    private final PaysRepository repository;

    public PaysService(PaysRepository repository) {
        this.repository = repository;
    }

    public Optional<Pays> get(Integer id) {
        return repository.findById(id);
    }

    public List<Pays> getAll() {
        return repository.findAll();
    }
}
