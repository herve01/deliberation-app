package com.deliberation.repository.inscription;

import com.deliberation.model.inscription.Etudiant;
import com.deliberation.model.inscription.Mention;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface EtudiantRepository extends JpaRepository<Etudiant, String> {

    Optional<Etudiant> findByMatricule(String matricule);

    List<Etudiant> findByNomContainingIgnoreCase(String nom);

    @Query("""
    SELECT COUNT(e)
    FROM Etudiant e
    WHERE e.createdAt >= :debut
    AND e.createdAt < :fin
    """)
    long countBetween(LocalDateTime debut, LocalDateTime fin);
}