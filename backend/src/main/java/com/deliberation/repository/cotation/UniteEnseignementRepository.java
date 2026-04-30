package com.deliberation.repository.cotation;

import com.deliberation.model.cotation.Semestre;
import com.deliberation.model.cotation.UniteEnseignement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UniteEnseignementRepository extends JpaRepository<UniteEnseignement, String> {

    Optional<UniteEnseignement> findByCode(String code);
}