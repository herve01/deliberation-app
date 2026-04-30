package com.deliberation.repository.cotation;

import com.deliberation.model.cotation.Semestre;
import com.deliberation.model.inscription.Inscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SemestreRepository extends JpaRepository<Semestre, String> {

    List<Semestre> findByNiveauId(String niveauId);

    List<Semestre> findByNiveauIdOrderByOrdreAsc(String niveauId);
}