package com.deliberation.repository.cotation;

import com.deliberation.model.cotation.NoteMention;
import com.deliberation.model.cotation.NoteMentionDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NoteMentionDetailRepository extends JpaRepository<NoteMentionDetail, String> {

    List<NoteMentionDetail> findByInscriptionId(String inscriptionId);

    List<NoteMentionDetail> findByEcueId(String ecueId);

    List<NoteMentionDetail> findByInscriptionIdAndEcueId(String inscriptionId, String ecueId);
}