package com.stockofrigo.backend.repository;

import com.stockofrigo.backend.model.Home;
import com.stockofrigo.backend.model.ShoppingList;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ShoppingListRepository extends JpaRepository<ShoppingList, Long> {
  List<ShoppingList> findByHomeId(Long homeId);

  Optional<ShoppingList> findByIdAndHome(Long id, Home home);
}
