package com.deliberation.repository.inscription;

import com.deliberation.model.inscription.Cycle;
import com.deliberation.model.inscription.Domaine;
import com.deliberation.model.inscription.Niveau;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CycleRepository extends JpaRepository<Cycle, String> {

    List<Cycle> findAllByOrderByOrdreAsc();
}