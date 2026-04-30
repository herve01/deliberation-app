package com.deliberation.repository.setting;

import com.deliberation.model.setting.Pays;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaysRepository extends JpaRepository<Pays, Integer> {

    // Rechercher par nom (partiel)
    List<Pays> findByNomContainingIgnoreCase(String nom);

    // Filtrer les pays actifs
    List<Pays> findByActif(Integer actif);

    // Combinaison (actif + nom)
    List<Pays> findByActifAndNomContainingIgnoreCase(Integer actif, String nom);
}
