package com.deliberation.service.cotation;

import com.deliberation.model.cotation.MentionSemestreEcue;
import com.deliberation.model.cotation.MentionSemestreEcueDetail;
import com.deliberation.repository.cotation.CotationDetailRepository;
import com.deliberation.repository.cotation.MentionSemestreEcueDetailRepository;
import com.deliberation.repository.cotation.MentionSemestreEcueRepository;
import com.deliberation.service.IService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

@Service
public class MentionSemestreEcueDetailService implements IService<MentionSemestreEcueDetail, String> {

    private final MentionSemestreEcueDetailRepository repository;
    private final CotationDetailRepository detailRepository;

    public MentionSemestreEcueDetailService(MentionSemestreEcueDetailRepository repository, CotationDetailRepository detailRepository) {
        this.repository = repository;
        this.detailRepository = detailRepository;
    }

    @Override
    public MentionSemestreEcueDetail create(MentionSemestreEcueDetail instance) {
        instance.setId(UUID.randomUUID().toString().replace("-", ""));
        return repository.save(instance);
    }

    @Override
    public MentionSemestreEcueDetail update(String id, MentionSemestreEcueDetail instance) {
        instance.setId(id);
        return repository.save(instance);
    }

    @Override
    public void delete(String id) {
        repository.deleteById(id);
    }

    @Override
    public Optional<MentionSemestreEcueDetail> get(String id) {
        return repository.findById(id);
    }

    @Override
    public List<MentionSemestreEcueDetail> getAll() {
        return repository.findAll();
    }

    public List<MentionSemestreEcueDetail> getAll(String mentionId) {
        return repository.findByMentionSemestreIdOrderByUe(mentionId);
    }

    /*public List<MentionSemestreEcueDetail> getAll(String mentionId, String semestreId, String anneeId) {
        return repository.findBy(mentionId, semestreId, anneeId);
    }
    /
     */

    @Override
    public Long count() {
        return repository.count();
    }

    public Float sum(String mentionSemestreId) {
        return repository.sumCreditByMentionSemestreId(mentionSemestreId);
    }

    public Float sum(List<MentionSemestreEcue> mentionSemestres) {
        return (float) mentionSemestres.stream()
                .map(MentionSemestreEcue::getId)
                .map(repository::sumCreditByMentionSemestreId)
                .filter(Objects::nonNull)
                .mapToDouble(Float::doubleValue)
                .sum();
    }
}