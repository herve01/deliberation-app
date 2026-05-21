package com.deliberation.repository.inscription;

import com.deliberation.model.inscription.Domaine;
import com.deliberation.model.inscription.Filiere;
import com.deliberation.model.inscription.Mention;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FiliereRepository extends JpaRepository<Filiere, String> {

    List<Filiere> findByDomaineId(String domaineId);

    @Query("SELECT f FROM Filiere f " +
            "LEFT JOIN FETCH f.domaine")
    List<Filiere> findAllWithRelations();
}