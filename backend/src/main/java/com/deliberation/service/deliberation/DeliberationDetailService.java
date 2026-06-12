package com.deliberation.service.deliberation;

import com.deliberation.model.deliberation.DeliberationDetail;
import com.deliberation.repository.deliberation.DeliberationDetailRepository;
import com.deliberation.service.IService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicReference;

@Service
public class DeliberationDetailService implements IService<DeliberationDetail, String> {

    private final DeliberationDetailRepository repository;

    public DeliberationDetailService(DeliberationDetailRepository repository) {
        this.repository = repository;
    }

    @Override
    public DeliberationDetail create(DeliberationDetail instance) {
        instance.setId(UUID.randomUUID().toString().replace("-", ""));
        return repository.save(instance);
    }

    @Override
    public DeliberationDetail update(String id, DeliberationDetail instance) {
        instance.setId(id);
        return repository.save(instance);
    }

    @Override
    public void delete(String id) {
        repository.deleteById(id);
    }

    @Override
    public Optional<DeliberationDetail> get(String id) {
        return repository.findById(id);
    }

    public Optional<DeliberationDetail> get(String deliberationId, String inscriptionId) {
        return repository.findOneByDeliberationIdAndInscriptionId(deliberationId, inscriptionId);
    }

    public Optional<DeliberationDetail> get(String deliberationId, String inscriptionId, String semestreId) {

        if (!"-1".equals(semestreId.trim())) {
            return repository.findOneByDeliberationIdAndInscriptionId(deliberationId, inscriptionId);
        }

        var deliberations = repository.findByInscriptionId(inscriptionId);

        if (deliberations.isEmpty()) {
            return Optional.empty();
        }

        float credits = (float) deliberations.stream()
                .mapToDouble(DeliberationDetail::getCredits)
                .sum();

        float valides = (float) deliberations.stream()
                .mapToDouble(DeliberationDetail::getValides)
                .sum();

        float moyenne = (float) deliberations.stream()
                .mapToDouble(DeliberationDetail::getMoyenne)
                .sum()/2F;


        var result = new DeliberationDetail();
        result.setId(deliberations.get(0).getId());
        result.setInscription(deliberations.get(0).getInscription());
        result.setCredits(credits);
        result.setValides(valides);
        result.setMoyenne(moyenne);

        return Optional.of(result);
    }

    @Override
    public List<DeliberationDetail> getAll() {
        return repository.findAll();
    }

    @Override
    public Long count() {
        return repository.count();
    }

    public Optional<DeliberationDetail> getPrevious(String inscriptionId, String semestreId, String sessionId) {
        return repository.findPreviousDeliberations(inscriptionId, semestreId, sessionId).stream().findFirst();
    }
}