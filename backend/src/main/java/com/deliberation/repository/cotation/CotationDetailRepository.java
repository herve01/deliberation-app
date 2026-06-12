package com.deliberation.repository.cotation;

import com.deliberation.model.cotation.CotationDetail;
import com.deliberation.model.cotation.pojo.EchecEcueProjection;
import com.deliberation.model.cotation.pojo.IEchecEcueProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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

    @Query(value = """
        SELECT
            t.mention_semestre_ecue_id AS mentionSemestreEcueId,
            COALESCE(COUNT(*), 0) AS count
        FROM (
            SELECT
                cde.inscription_id,
                cde.mention_semestre_ecue_id,
                SUM(cde.note) AS note
            FROM cotation c
            INNER JOIN cotation_detail cde
                ON c.id = cde.cotation_id
            WHERE c.mention_id = :mentionId 
            AND c.annee_id = :anneeId
            AND cde.mention_semestre_ecue_id = :mentionSemestreEcueId
            AND  c.semestre_id = :semestreId
              AND c.session_id IN (
                    SELECT s.id
                    FROM session s
                    WHERE s.numero < (
                        SELECT s2.numero
                        FROM session s2
                        WHERE s2.id = :sessionId
                    )
                    AND s.semestre_id = :semestreId
              )
            GROUP BY
                cde.inscription_id,
                cde.mention_semestre_ecue_id
            HAVING SUM(cde.note) < 10
        ) t
        GROUP BY t.mention_semestre_ecue_id
        """, nativeQuery = true)
    Optional<IEchecEcueProjection> countEchecsByMentionSemestreEcue(
            @Param("mentionId") String mentionId,
            @Param("anneeId") String anneeId,
            @Param("semestreId") String semestreId,
            @Param("sessionId") String sessionId,
            @Param("mentionSemestreEcueId") String mentionSemestreEcueId
            );


    @Query(value = """
    SELECT COUNT(*)
    FROM (
        SELECT 1
        FROM cotation c
        INNER JOIN cotation_detail cde
            ON c.id = cde.cotation_id
        WHERE c.mention_id = :mentionId
          AND c.annee_id = :anneeId
          AND c.semestre_id = :semestreId
          AND cde.mention_semestre_ecue_id = :mentionSemestreEcueId
          AND c.session_id IN (
                SELECT s.id
                FROM session s
                WHERE s.numero < (
                    SELECT s2.numero
                    FROM session s2
                    WHERE s2.id = :sessionId
                )
                AND s.semestre_id = :semestreId
          )
        GROUP BY cde.mention_semestre_ecue_id
        HAVING SUM(cde.note) > 0
    ) t
    """, nativeQuery = true)
    long countEchecsByMentionSemestreEcue2(
            @Param("mentionId") String mentionId,
            @Param("anneeId") String anneeId,
            @Param("semestreId") String semestreId,
            @Param("sessionId") String sessionId,
            @Param("mentionSemestreEcueId") String mentionSemestreEcueId
    );
}