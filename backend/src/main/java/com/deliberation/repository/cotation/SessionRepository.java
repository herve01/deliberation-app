package com.deliberation.repository.cotation;

import com.deliberation.model.cotation.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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

    @Query("""
    SELECT s
    FROM Session s
    WHERE s.semestre.id = :v_semestreId
    AND (
        s.numero <= (
            SELECT s2.numero
            FROM Session s2
            WHERE s2.id = :v_sessionId
        )
        OR s.estAnnuel = true
    )
    ORDER BY
        CASE
            WHEN s.estAnnuel = true THEN 999
            ELSE s.numero
        END
    """)
    List<Session> findSessionsForDeliberation(@Param("v_semestreId") String semestreId, @Param("v_sessionId") String sessionId);
}