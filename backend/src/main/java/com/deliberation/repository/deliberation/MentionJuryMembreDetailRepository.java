package com.deliberation.repository.deliberation;

import com.deliberation.model.deliberation.MentionJuryMembreDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MentionJuryMembreDetailRepository extends JpaRepository<MentionJuryMembreDetail, String> {

    List<MentionJuryMembreDetail> findByAnneeId(String anneeId);

    List<MentionJuryMembreDetail> findByPersonnelId(String personnelId);

    List<MentionJuryMembreDetail> findByAnneeIdAndRole(String anneeId, String role);
}