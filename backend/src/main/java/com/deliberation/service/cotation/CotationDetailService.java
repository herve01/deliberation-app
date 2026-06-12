package com.deliberation.service.cotation;

import com.deliberation.model.cotation.CotationDetail;
import com.deliberation.model.cotation.pojo.EchecEcueProjection;
import com.deliberation.repository.cotation.CotationDetailRepository;
import com.deliberation.service.IService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class CotationDetailService implements IService<CotationDetail, String> {

    private final CotationDetailRepository repository;

    public CotationDetailService(CotationDetailRepository repository) {
        this.repository = repository;
    }

    @Override
    public CotationDetail create(CotationDetail instance) {
        instance.setId(UUID.randomUUID().toString().replace("-", ""));
        return repository.save(instance);
    }

    @Override
    public CotationDetail update(String id, CotationDetail instance) {
        instance.setId(id);
        return repository.save(instance);
    }

    @Override
    public void delete(String id) {
        repository.deleteById(id);
    }

    @Override
    public Optional<CotationDetail> get(String id) {
        return repository.findById(id);
    }

    public Optional<EchecEcueProjection> countEchecsByMentionSemestreEcue(String mentionId, String anneeId, String semestreId, String sessionId, String mentionSemestreEcueId) {
        var echec = new EchecEcueProjection();
        var result = repository.countEchecsByMentionSemestreEcue(mentionId, anneeId, semestreId, sessionId, mentionSemestreEcueId);

        if (result.isPresent()) {
            echec.setMentionSemestreEcueId(result.get().getMentionSemestreEcueId());
            echec.setCount(result.get().getCount());
        }

        return Optional.of(echec);
    }

    public Optional<CotationDetail> get(String cotationId, String mentionSemestreEcueId) {
        return repository.findOneByCotationIdAndMentionSemestreEcueId(cotationId, mentionSemestreEcueId);
    }

    public List<CotationDetail> getAll(String cotationId, String mentionSemestreEcueId, String inscriptionId) {
        return repository.findByCotationIdAndMentionSemestreEcueIdAndInscriptionId(cotationId, mentionSemestreEcueId, inscriptionId);
    }

    @Override
    public List<CotationDetail> getAll() {
        return repository.findAll();
    }

    public List<CotationDetail> getAll(String cotationId, String mentionSemestreEcueId) {
        return repository.findByCotationIdAndMentionSemestreEcueId(cotationId, mentionSemestreEcueId);
    }

    public List<CotationDetail> getAllByCotationInscription(String cotationId, String inscriptionId) {
        return repository.findByCotationIdAndInscriptionId(cotationId, inscriptionId);
    }

    public long count(String cotationId, String mentionSemestreEcueId)
    {
        return  repository.countByCotationIdAndMentionSemestreEcueIdAndNoteIsNotNull(cotationId, mentionSemestreEcueId);
    }

    public long countEchecsByMentionSemestreEcue2(String anneeId, String mentionId, String semestreId, String sessionId, String mentionSemestreEcueId) {
        return repository.countEchecsByMentionSemestreEcue2(mentionId, anneeId, semestreId, sessionId, mentionSemestreEcueId);
    }

    @Override
    public Long count() {
        return repository.count();
    }
}