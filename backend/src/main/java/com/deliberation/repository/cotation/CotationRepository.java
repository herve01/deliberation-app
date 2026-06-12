package com.deliberation.repository.cotation;

import com.deliberation.model.cotation.Cotation;
import com.deliberation.model.cotation.Semestre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CotationRepository extends JpaRepository<Cotation, String> {

    List<Cotation> findByMentionId(String mentionId);

    List<Cotation> findByAnneeId(String anneeId);

    List<Cotation> findBySemestreId(String semestreId);

    Optional<Cotation> findOneByAnneeIdAndMentionIdAndSemestreIdAndSessionId(String anneeId, String mentionId, String semestreId, String sessionId);

    List<Cotation> findByMentionIdAndAnneeId(String mentionId, String anneeId);

    List<Cotation> findByMentionIdAndAnneeIdAndSemestreId(String mentionId, String anneeId, String semestreId);
}