package com.deliberation.repository.inscription;

import com.deliberation.model.inscription.AnneeAcademique;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface AnneeRepository extends JpaRepository<AnneeAcademique, String> {

    Optional<AnneeAcademique> findByAnnee(String annee);

    boolean existsByAnnee(String annee);

    Optional<AnneeAcademique> findByDateOuvertureLessThanEqualAndDateClotureGreaterThanEqual(
            LocalDate today1, LocalDate today2
    );

    Optional<AnneeAcademique> findTopByDateClotureLessThanOrderByDateClotureDesc(LocalDate today);

    Optional<AnneeAcademique> findTopByDateOuvertureGreaterThanOrderByDateOuvertureAsc(LocalDate today);
}