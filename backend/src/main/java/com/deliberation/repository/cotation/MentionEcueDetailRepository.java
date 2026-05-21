package com.deliberation.repository.cotation;

import com.deliberation.model.cotation.Ecue;
import com.deliberation.model.cotation.MentionEcueDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MentionEcueDetailRepository extends JpaRepository<MentionEcueDetail, String> {

    List<MentionEcueDetail> findByMentionId(String mentionId);

    List<MentionEcueDetail> findBySemestreId(String semestreId);

    List<MentionEcueDetail> findByMentionIdAndSemestreIdAndAnneeId(String mentionId, String semestreId, String anneeId);
}