package com.deliberation.repository.cotation;

import com.deliberation.model.cotation.NoteMention;
import com.deliberation.model.cotation.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NoteMentionRepository extends JpaRepository<NoteMention, String> {

    List<NoteMention> findByMentionId(String mentionId);

    List<NoteMention> findByAnneeId(String anneeId);

    List<NoteMention> findBySemestreId(String semestreId);

    List<NoteMention> findBySessionId(String sessionId);

    List<NoteMention> findByMentionIdAndAnneeId(String mentionId, String anneeId);
}