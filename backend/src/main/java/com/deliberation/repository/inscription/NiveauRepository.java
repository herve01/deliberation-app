package com.deliberation.repository.inscription;

import com.deliberation.model.inscription.AnneeAcademique;
import com.deliberation.model.inscription.Niveau;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NiveauRepository extends JpaRepository<Niveau, String> {

    List<Niveau> findAllByOrderByOrdreAsc();
}