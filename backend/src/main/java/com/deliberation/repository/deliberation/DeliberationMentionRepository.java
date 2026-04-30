package com.deliberation.repository.deliberation;

import com.deliberation.model.deliberation.DeliberationMention;
import com.deliberation.model.deliberation.MentionJuryMembreDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DeliberationMentionRepository extends JpaRepository<DeliberationMention, String> {

    List<DeliberationMention> findByMentionId(String mentionId);

    List<DeliberationMention> findByAnneeId(String anneeId);

    List<DeliberationMention> findBySemestreId(String semestreId);

    List<DeliberationMention> findBySessionId(String sessionId);

    List<DeliberationMention> findByMentionIdAndAnneeId(String mentionId, String anneeId);
}