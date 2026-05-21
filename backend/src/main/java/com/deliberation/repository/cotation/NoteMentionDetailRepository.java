package com.deliberation.repository.cotation;

import com.deliberation.model.cotation.NoteMention;
import com.deliberation.model.cotation.NoteMentionDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NoteMentionDetailRepository extends JpaRepository<NoteMentionDetail, String> {

    List<NoteMentionDetail> findByInscription_Id(String inscriptionId);

    List<NoteMentionDetail> findByEcue_Id(String ecueId);

    List<NoteMentionDetail> findByNoteMention_IdAndInscription_IdAndEcue_Id(
            String noteMentionId,
            String inscriptionId,
            String ecueId
    );

    List<NoteMentionDetail> findByNoteMention_IdAndInscription_Id(
            String noteMentionId,
            String inscriptionId
    );

    List<NoteMentionDetail> findByNoteMention_Id(String noteMentionId);
}