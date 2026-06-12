package com.deliberation.service.cotation;

import com.deliberation.model.cotation.Cotation;
import com.deliberation.model.cotation.MentionSemestreEcue;
import com.deliberation.repository.cotation.CotationDetailRepository;
import com.deliberation.repository.cotation.CotationRepository;
import com.deliberation.repository.cotation.MentionSemestreEcueDetailRepository;
import com.deliberation.repository.cotation.MentionSemestreEcueRepository;
import com.deliberation.repository.inscription.InscriptionRepository;
import com.deliberation.service.IService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class MentionSemestreEcueService implements IService<MentionSemestreEcue, String> {

    private final MentionSemestreEcueRepository repository;
    private final MentionSemestreEcueDetailRepository detailRepository;


    private static final Logger logger = LoggerFactory.getLogger(MentionSemestreEcueService.class);

    public MentionSemestreEcueService(MentionSemestreEcueRepository repository, MentionSemestreEcueDetailRepository detailRepository) {
        this.repository = repository;
        this.detailRepository = detailRepository;
    }

    @Override
    public MentionSemestreEcue create(MentionSemestreEcue instance) {
        instance.setId(UUID.randomUUID().toString().replace("-", ""));
        return repository.save(instance);
    }

    @Transactional
    public MentionSemestreEcue createAll(MentionSemestreEcue instance) {

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
        MentionSemestreEcue saved = repository.save(instance);

        // Sauvegarde détails
        if (details != null && !details.isEmpty()) {
            detailRepository.saveAll(details);
        }

        return saved;
    }

    @Override
    public MentionSemestreEcue update(String id, MentionSemestreEcue instance) {
        instance.setId(id);
        return repository.save(instance);
    }

    @Override
    public void delete(String id) {
        repository.deleteById(id);
    }

    @Override
    public Optional<MentionSemestreEcue> get(String id) {
        return repository.findById(id);
    }

    @Override
    public List<MentionSemestreEcue> getAll() {
        return repository.findAll();
    }

    public List<MentionSemestreEcue> getAll(String mentionId, String semestreId, String anneeId) {
        return semestreId.trim().equals("-1") ?
                repository.findByMentionIdAndAndAnneeId(mentionId, anneeId)
                : List.of(repository.findOneByMentionIdAndSemestreIdAndAnneeId(mentionId, semestreId, anneeId).get());
    }

    @Override
    public Long count() {
        return repository.count();
    }

    /***
     *
     * @param mentionId
     * @param semestreId
     * @param anneeId
     * @return
     */
    public Optional<MentionSemestreEcue> get(String mentionId, String semestreId, String anneeId) {

        return repository
            .findOneByMentionIdAndSemestreIdAndAnneeId(
                    mentionId, semestreId, anneeId)
            .map(mention -> {
                logger.info("[MentionSemestreEcueService] Mention trouvée : {}", mention.getId());

                var details = detailRepository.findByMentionSemestreIdOrderByUe(mention.getId());

                mention.setDetails(details);

                return mention;
            });
    }

    public Optional<MentionSemestreEcue> getOne(String mentionId, String semestreId, String anneeId) {

        return repository
                .findOneByMentionIdAndSemestreIdAndAnneeId(mentionId, semestreId, anneeId);
    }
}