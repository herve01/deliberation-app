package com.deliberation.repository.deliberation;

import com.deliberation.model.deliberation.Personnel;
import com.deliberation.model.deliberation.PersonnelAffectationMentionEcue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PersonnelAffectationMentionEcueRepository extends JpaRepository<PersonnelAffectationMentionEcue, String> {


}