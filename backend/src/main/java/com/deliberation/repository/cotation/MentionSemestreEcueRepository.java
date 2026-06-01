package com.deliberation.repository.cotation;

import com.deliberation.model.cotation.MentionSemestreEcue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MentionSemestreEcueRepository extends JpaRepository<MentionSemestreEcue, String> {

    List<MentionSemestreEcue> findByMentionId(String mentionId);

    List<MentionSemestreEcue> findBySemestreId(String semestreId);

    List<MentionSemestreEcue> findByMentionIdAndAndAnneeId(String mentionId, String anneeId);

    Optional<MentionSemestreEcue> findOneByMentionIdAndSemestreIdAndAnneeId(String mentionId, String semestreId, String anneeId);
}