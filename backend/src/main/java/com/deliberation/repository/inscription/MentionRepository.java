package com.deliberation.repository.inscription;

import com.deliberation.model.inscription.Filiere;
import com.deliberation.model.inscription.Mention;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MentionRepository extends JpaRepository<Mention, String> {

    List<Mention> findByNiveauId(String niveauId);

    List<Mention> findByFiliereIdOrderByNiveauOrdreAsc(String filiereId);

    List<Mention> findByNiveauIdAndFiliereId(String niveauId, String filiereId);
}