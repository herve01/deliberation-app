package com.deliberation.repository.inscription;

import com.deliberation.model.inscription.Inscription;
import com.deliberation.model.inscription.Mention;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface InscriptionRepository extends JpaRepository<Inscription, String> {

    // Par étudiant
    List<Inscription> findAllByEtudiant_Id(String etudiantId);

    // Par année académique
    List<Inscription> findAllByAnnee_Id(String anneeId);

    // Par mention
    List<Inscription> findAllByMention_Id(String mentionId);

    // Par année + mention
    List<Inscription> findAllByAnnee_IdAndMention_Id(String anneeId, String mentionId);

    // Par étudiant + année
    List<Inscription> findAllByEtudiant_IdAndAnnee_Id(String etudiantId, String anneeId);

    // Par étudiant + année + mention (IMPORTANT)
    Optional<Inscription> findOneByEtudiant_IdAndAnnee_IdAndMention_Id(
            String etudiantId,
            String anneeId,
            String mentionId
    );

    // Vérifier existence (plus performant)
    boolean existsByEtudiant_IdAndAnnee_IdAndMention_Id(
            String etudiantId,
            String anneeId,
            String mentionId
    );

    long countByAnneeIdAndMentionId(String anneeId, String mentionId);

    long countByAnneeId(String anneeId);

    @Query("""
    SELECT COUNT(i)
    FROM Inscription i
    WHERE i.annee.id = :anneeId
    AND i.date >= :debut
    AND i.date < :fin
    """)
    long countByAnneeAndDateBetween(
            String anneeId,
            LocalDateTime debut,
            LocalDateTime fin
    );

    @Query("""
    SELECT COUNT(i)
    FROM Inscription i
    WHERE i.date >= :debut
    AND i.date < :fin
    """)
    long countByDateBetween(
            LocalDateTime debut,
            LocalDateTime fin
    );

    @Query("""
        SELECT i
        FROM Inscription i
        WHERE i.mention.id = :mentionId
          AND i.annee.id = :anneeId
          AND NOT EXISTS (
              SELECT d.id
              FROM DeliberationDetail d
              JOIN d.deliberation de
              WHERE d.inscription.id = i.id
                AND de.annee.id = :anneeId
                AND de.mention.id = :mentionId
                AND de.semestre.id = :semestreId      
                AND de.session.numero < (
                SELECT s.numero
                FROM Session s
                WHERE s.id = :sessionId)
                AND d.valides = d.credits
          )
    """)
    List<Inscription> findEligibleInscriptions(
            @Param("mentionId") String mentionId, @Param("anneeId") String anneeId,
            @Param("semestreId") String semestreId, @Param("sessionId") String sessionId);


    @Query(value = """
    SELECT i.*
    FROM inscription i
    WHERE i.mention_id = :mentionId
      AND i.annee_id = :anneeId
      AND NOT EXISTS (
          SELECT 1
          FROM cotation c
          INNER JOIN cotation_detail cd
              ON c.id = cd.cotation_id
          WHERE cd.inscription_id = i.id
            AND cd.mention_semestre_ecue_id = :mentionSemestreEcueId
            AND c.mention_id = :mentionId
            AND c.semestre_id = :semestreId
            AND c.session_id IN (
                SELECT s.id
                FROM session s
                WHERE s.numero < (
                    SELECT s2.numero
                    FROM session s2
                    WHERE s2.id = :sessionId
                )
            )
          GROUP BY cd.mention_semestre_ecue_id
          HAVING SUM(cd.note) >= 10
      )
    """, nativeQuery = true)
    List<Inscription> findInscriptions(
            String mentionId,
            String anneeId,
            String semestreId,
            String sessionId,
            String mentionSemestreEcueId
            );

    @Query(value = """
    SELECT count(*)
    FROM inscription i
    WHERE i.mention_id = :mentionId
      AND i.annee_id = :anneeId
      AND NOT EXISTS (
          SELECT 1
          FROM cotation c
          INNER JOIN cotation_detail cd
              ON c.id = cd.cotation_id
          WHERE cd.inscription_id = i.id
            AND cd.mention_semestre_ecue_id = :mentionSemestreEcueId
            AND c.mention_id = :mentionId
            AND c.semestre_id = :semestreId
            AND c.session_id IN (
                SELECT s.id
                FROM session s
                WHERE s.numero < (
                    SELECT s2.numero
                    FROM session s2
                    WHERE s2.id = :sessionId
                )
            )
          GROUP BY cd.mention_semestre_ecue_id
          HAVING SUM(cd.note) >= 10
      )
    """, nativeQuery = true)
    long countByMentionAnnneeSemestreSessionMentionSemestre(
            String mentionId,
            String anneeId,
            String semestreId,
            String sessionId,
            String mentionSemestreEcueId
    );
}