package com.deliberation.service.deliberation;

import com.deliberation.model.deliberation.Personnel;
import com.deliberation.model.deliberation.PersonnelAffectationMentionEcue;
import com.deliberation.repository.deliberation.PersonnelAffectationMentionEcueRepository;
import com.deliberation.repository.deliberation.PersonnelRepository;
import com.deliberation.service.IService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class PersonnelAffectationMentionEcueService implements IService<PersonnelAffectationMentionEcue, String> {

    private final PersonnelAffectationMentionEcueRepository repository;

    public PersonnelAffectationMentionEcueService(PersonnelAffectationMentionEcueRepository repository) {
        this.repository = repository;
    }

    @Override
    public PersonnelAffectationMentionEcue create(PersonnelAffectationMentionEcue instance) {
        instance.setId(UUID.randomUUID().toString());
        return repository.save(instance);
    }

    @Override
    public PersonnelAffectationMentionEcue update(String id, PersonnelAffectationMentionEcue instance) {
        instance.setId(id);
        return repository.save(instance);
    }

    @Override
    public void delete(String id) {
        repository.deleteById(id);
    }

    @Override
    public Optional<PersonnelAffectationMentionEcue> get(String id) {
        return repository.findById(id);
    }

    @Override
    public List<PersonnelAffectationMentionEcue> getAll() {
        return repository.findAll();
    }

}