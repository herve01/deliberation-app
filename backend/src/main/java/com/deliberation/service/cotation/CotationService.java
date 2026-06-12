package com.deliberation.service.cotation;

import com.deliberation.model.cotation.Cotation;
import com.deliberation.repository.cotation.CotationDetailRepository;
import com.deliberation.repository.cotation.CotationRepository;
import com.deliberation.repository.inscription.MentionRepository;
import com.deliberation.service.IService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class CotationService implements IService<Cotation, String> {

    private final CotationRepository repository;
    private final CotationDetailRepository detailRepository;
    private final MentionRepository mentionRepository;

    private static final Logger logger = LoggerFactory.getLogger(CotationService.class);

    public CotationService(CotationRepository repository, CotationDetailRepository detailRepository, MentionRepository mentionRepository) {
        this.repository = repository;
        this.detailRepository = detailRepository;
        this.mentionRepository = mentionRepository;
    }

    @Override
    public Cotation create(Cotation instance) {
        instance.setId(UUID.randomUUID().toString().replace("-", ""));
        return repository.save(instance);
    }

    @Transactional
    public Cotation createAll(Cotation instance) {

        if(instance.getId().isEmpty())
            instance.setId(UUID.randomUUID().toString().replace("-", ""));

        var details = instance.getDetails();

        if (details != null && !details.isEmpty()) {
            details.forEach(detail -> {
                if(detail.getId().isEmpty())
                    detail.setId(UUID.randomUUID().toString().replace("-", ""));
            });
        }
        logger.info("[data] {} ", instance);

        // Sauvegarde parent
        Cotation saved = repository.save(instance);

        // Sauvegarde détails
        if (details != null && !details.isEmpty()) {
            detailRepository.saveAll(details);
        }

        return saved;
    }

    @Override
    public Cotation update(String id, Cotation instance) {
        instance.setId(id);
        return repository.save(instance);
    }

    @Transactional
    public Cotation updateAll(String id, Cotation instance) {

        instance.setId(id);

        var details = instance.getDetails();

        // STRATÉGIE SIMPLE : suppression + réinsertion des détails
        if (details != null) {

            details.forEach(detail -> {
                detail.setCotation(instance); // important pour relation
            });

            detailRepository.saveAll(details);

            instance.setDetails(details);
        }

        logger.info("[update data] {}", instance);

        return repository.save(instance);
    }

    @Override
    public void delete(String id) {
        repository.deleteById(id);
    }

    @Override
    public Optional<Cotation> get(String id) {
        return repository.findById(id);
    }

    /***
     *
     * @param mentionId
     * @param semestreId
     * @param anneeId
     * @param sessionId
     * @param mentionSemestreEcueId
     * @return
     */
    public Optional<Cotation> get(String mentionId, String semestreId, String anneeId, String sessionId, String mentionSemestreEcueId) {
        return repository
            .findOneByAnneeIdAndMentionIdAndSemestreIdAndSessionId(anneeId, mentionId, semestreId, sessionId)
            .map(cotation -> {

                logger.info("[CotationMentionService] Cotation trouvée : {}", cotation.getId());

                var details = detailRepository.findByCotationIdAndMentionSemestreEcueId(cotation.getId(), mentionSemestreEcueId);

                cotation.setDetails(details);

                return cotation;
            });
    }

    public Optional<Cotation> get(String anneeId, String mentionId, String semestreId, String sessionId) {

        return repository.findOneByAnneeIdAndMentionIdAndSemestreIdAndSessionId(anneeId, mentionId, semestreId, sessionId);
    }

    @Override
    public List<Cotation> getAll() {
        return repository.findAll();
    }

    public List<Cotation> getAll(String anneeId, String mentionId) {
        return repository.findByMentionIdAndAnneeId(mentionId, anneeId);
    }

    @Override
    public Long count() {
        return repository.count();
    }
}