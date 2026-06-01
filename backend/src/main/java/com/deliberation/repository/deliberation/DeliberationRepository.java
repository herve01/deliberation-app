package com.deliberation.repository.deliberation;

import com.deliberation.model.deliberation.Deliberation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DeliberationRepository extends JpaRepository<Deliberation, String> {

    List<Deliberation> findByMentionId(String mentionId);

    List<Deliberation> findByAnneeId(String anneeId);

    List<Deliberation> findBySemestreId(String semestreId);

    List<Deliberation> findBySessionId(String sessionId);

    List<Deliberation> findByMentionIdAndAnneeId(String mentionId, String anneeId);
}