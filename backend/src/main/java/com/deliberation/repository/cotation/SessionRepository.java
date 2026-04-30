package com.deliberation.repository.cotation;

import com.deliberation.model.cotation.MentionEcueDetail;
import com.deliberation.model.cotation.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SessionRepository extends JpaRepository<Session, String> {

    List<Session> findBySemestreId(String semestreId);

    List<Session> findBySemestreIdOrderByNumeroAsc(String semestreId);
}