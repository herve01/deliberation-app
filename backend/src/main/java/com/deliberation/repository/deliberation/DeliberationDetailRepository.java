package com.deliberation.repository.deliberation;

import com.deliberation.model.deliberation.DeliberationDetail;
import com.deliberation.model.inscription.Inscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DeliberationDetailRepository extends JpaRepository<DeliberationDetail, String> {

    List<DeliberationDetail> findByInscriptionId(String inscriptionId);

    List<DeliberationDetail> findByAEchoue(Boolean aEchoue);

    List<DeliberationDetail> findByDecision(String decision);

    Optional<DeliberationDetail> findOneByDeliberationIdAndInscriptionId(String deliberationId, String inscriptionId);

    @Query("""
    SELECT d
    FROM DeliberationDetail d
    JOIN d.deliberation de
    WHERE d.inscription.id = :v_inscriptionId
      AND de.semestre.id = :v_semestreId
      AND de.session.numero < (
            SELECT s.numero
            FROM Session s
            WHERE s.id = :v_sessionId
      )
      AND d.valides < d.credits
    ORDER BY de.session.numero DESC
""")
    List<DeliberationDetail> findPreviousDeliberations(
            @Param("v_inscriptionId") String inscriptionId,
            @Param("v_semestreId") String semestreId,
            @Param("v_sessionId") String sessionId);
}