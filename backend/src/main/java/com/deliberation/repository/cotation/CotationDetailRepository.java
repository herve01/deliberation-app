package com.deliberation.repository.cotation;

import com.deliberation.model.cotation.CotationDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CotationDetailRepository extends JpaRepository<CotationDetail, String> {

    List<CotationDetail> findByInscription_Id(String inscriptionId);

    List<CotationDetail> findByMentionSemestreEcueId(String mentionSemestreEcueId);

    List<CotationDetail> findByCotationIdAndInscriptionIdAndMentionSemestreEcueId(
            String cotationId,
            String inscriptionId,
            String mentionSemestreEcueId
    );

    List<CotationDetail> findByCotationIdAndInscriptionId(
            String cotationId,
            String inscriptionId
    );

    List<CotationDetail> findByCotationId(String cotationId);

    List<CotationDetail> findByCotationIdAndMentionSemestreEcueId(String cotationId, String mentionSemestreEcueId);

    long countByCotationIdAndMentionSemestreEcueIdAndNoteIsNotNull(String cotationId, String mentionSemestreEcueId);

    Optional<CotationDetail> findOneByCotationIdAndMentionSemestreEcueId(String cotationId, String mentionSemestreEcueId);

    List<CotationDetail> findByCotationIdAndMentionSemestreEcueIdAndInscriptionId(String cotationId, String mentionSemestreEcueId, String inscriptionId);
}