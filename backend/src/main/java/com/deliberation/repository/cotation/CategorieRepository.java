package com.deliberation.repository.cotation;

import com.deliberation.model.cotation.Categorie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategorieRepository extends JpaRepository<Categorie, String> {

}