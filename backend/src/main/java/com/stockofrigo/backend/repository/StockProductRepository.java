package com.stockofrigo.backend.repository;

import com.stockofrigo.backend.model.Home;
import com.stockofrigo.backend.model.StockProduct;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StockProductRepository extends JpaRepository<StockProduct, Long> {
  List<StockProduct> findAllByHome(Home home);
}
