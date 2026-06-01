package com.deliberation.repository.deliberation;

import com.deliberation.model.deliberation.DeliberationDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DeliberationDetailRepository extends JpaRepository<DeliberationDetail, String> {

    List<DeliberationDetail> findByInscriptionId(String inscriptionId);

    List<DeliberationDetail> findByAEchoue(Boolean aEchoue);

    List<DeliberationDetail> findByDecision(String decision);
}