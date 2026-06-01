package com.deliberation.repository.cotation;

import com.deliberation.model.cotation.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SessionRepository extends JpaRepository<Session, String> {

    List<Session> findBySemestreId(String semestreId);

    List<Session> findBySemestreIdOrderByNumeroAsc(String semestreId);

    List<Session> findAllByOrderBySemestre_NumeroAscNumeroAsc();

    List<Session> findAllByEstAnnuelFalseOrderBySemestre_NumeroAscNumeroAsc();

    Optional<Session> findOneBySemestreIdAndEstAnnuelIsTrue(String semestreId);
}