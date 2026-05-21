package com.deliberation.repository.deliberation;

import com.deliberation.model.deliberation.Personnel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PersonnelRepository extends JpaRepository<Personnel, String> {

    List<Personnel> findByNomContainingIgnoreCase(String nom);

    List<Personnel> findByGrade(Integer grade);
}