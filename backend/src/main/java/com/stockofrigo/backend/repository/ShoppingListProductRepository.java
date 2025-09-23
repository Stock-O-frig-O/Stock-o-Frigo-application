package com.stockofrigo.backend.repository;

import com.stockofrigo.backend.model.ShoppingList;
import com.stockofrigo.backend.model.ShoppingListProduct;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ShoppingListProductRepository extends JpaRepository<ShoppingListProduct, Long> {
  List<ShoppingListProduct> findByShoppingListId(Long shoppingListId);

  void deleteByProductId(Long productId);

  List<ShoppingListProduct> findAllByShoppingList(ShoppingList shoppingList);
}
