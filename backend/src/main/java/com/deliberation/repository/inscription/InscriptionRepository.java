package com.deliberation.repository.inscription;

import com.deliberation.model.inscription.Inscription;
import com.deliberation.model.inscription.Mention;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
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

}