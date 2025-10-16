package com.stockofrigo.backend.repository;

import com.stockofrigo.backend.model.FavoriteProduct;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FavoriteProductRepository extends JpaRepository<FavoriteProduct, Long> {
  List<FavoriteProduct> findByHomeId(Long homeId);

  List<FavoriteProduct> findAllByHomeIdAndProductIdIn(Long homeId, List<Long> productIds);

  boolean existsByHomeIdAndProductId(Long homeId, Long productId);
}
