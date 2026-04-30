package com.deliberation.service.deliberation;

import com.deliberation.model.deliberation.JuryMembre;
import com.deliberation.model.deliberation.MentionJuryMembreDetail;
import com.deliberation.repository.deliberation.JuryMembreRepository;
import com.deliberation.repository.deliberation.MentionJuryMembreDetailRepository;
import com.deliberation.service.IService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class MentionJuryMembreDetailService implements IService<MentionJuryMembreDetail, String> {

    private final MentionJuryMembreDetailRepository repository;

    public MentionJuryMembreDetailService(MentionJuryMembreDetailRepository repository) {
        this.repository = repository;
    }

    @Override
    public MentionJuryMembreDetail create(MentionJuryMembreDetail instance) {
        instance.setId(UUID.randomUUID().toString());
        return repository.save(instance);
    }

    @Override
    public MentionJuryMembreDetail update(String id, MentionJuryMembreDetail instance) {
        instance.setId(id);
        return repository.save(instance);
    }

    @Override
    public void delete(String id) {
        repository.deleteById(id);
    }

    @Override
    public Optional<MentionJuryMembreDetail> get(String id) {
        return repository.findById(id);
    }

    @Override
    public List<MentionJuryMembreDetail> getAll() {
        return repository.findAll();
    }
}