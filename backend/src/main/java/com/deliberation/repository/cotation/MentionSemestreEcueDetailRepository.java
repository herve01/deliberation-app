package com.deliberation.repository.cotation;

import com.deliberation.model.cotation.CotationDetail;
import com.deliberation.model.cotation.MentionSemestreEcueDetail;
import com.deliberation.model.cotation.MentionSemestreEcueDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MentionSemestreEcueDetailRepository extends JpaRepository<MentionSemestreEcueDetail, String> {

    List<MentionSemestreEcueDetail> findByMentionSemestreId(String mentionSemestreId);

    long countByMentionSemestreId(String mentionSemestreId);

    @Query("""
       SELECT COALESCE(SUM(m.credit), 0)
       FROM MentionSemestreEcueDetail m
       WHERE m.mentionSemestre.id = :mentionSemestreId
       """)
    Float sumCreditByMentionSemestreId(
            @Param("mentionSemestreId") String mentionSemestreId
    );

}