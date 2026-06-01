package com.deliberation.repository.deliberation;

import com.deliberation.model.deliberation.ChargeHorairePersonnel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChargeHorairePersonnelRepository extends JpaRepository<ChargeHorairePersonnel, String> {


}