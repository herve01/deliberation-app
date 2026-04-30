package com.deliberation.repository.deliberation;

import com.deliberation.model.deliberation.DeliberationMention;
import com.deliberation.model.deliberation.DeliberationMentionDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DeliberationMentionDetailRepository extends JpaRepository<DeliberationMentionDetail, String> {

    List<DeliberationMentionDetail> findByInscriptionId(String inscriptionId);

    List<DeliberationMentionDetail> findByAEchoue(Boolean aEchoue);

    List<DeliberationMentionDetail> findByMention(String mention);
}