package com.deliberation.repository.cotation;

import com.deliberation.model.cotation.Ecue;
import com.deliberation.model.cotation.UniteEnseignement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EcueRepository extends JpaRepository<Ecue, String> {

    //List<Ecue> findByUe_Id(String ueId);
}