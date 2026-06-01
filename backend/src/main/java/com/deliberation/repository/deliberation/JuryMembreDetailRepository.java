package com.deliberation.repository.deliberation;

import com.deliberation.model.deliberation.JuryMembreDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JuryMembreDetailRepository extends JpaRepository<JuryMembreDetail, String> {

    List<JuryMembreDetail> findByAnneeId(String anneeId);

    List<JuryMembreDetail> findByPersonnelId(String personnelId);

    List<JuryMembreDetail> findByAnneeIdAndRole(String anneeId, String role);
}