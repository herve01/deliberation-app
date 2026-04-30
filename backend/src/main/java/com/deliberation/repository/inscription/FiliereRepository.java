package com.deliberation.repository.inscription;

import com.deliberation.model.inscription.Domaine;
import com.deliberation.model.inscription.Filiere;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FiliereRepository extends JpaRepository<Filiere, String> {

    List<Filiere> findByDomaineId(String domaineId);
}