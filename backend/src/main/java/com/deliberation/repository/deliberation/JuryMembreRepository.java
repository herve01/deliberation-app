package com.deliberation.repository.deliberation;

import com.deliberation.model.cotation.NoteMentionDetail;
import com.deliberation.model.deliberation.JuryMembre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JuryMembreRepository extends JpaRepository<JuryMembre, String> {

    List<JuryMembre> findByNomContainingIgnoreCase(String nom);

    List<JuryMembre> findByGrade(Integer grade);
}