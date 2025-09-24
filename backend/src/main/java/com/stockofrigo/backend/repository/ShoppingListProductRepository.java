package com.stockofrigo.backend.repository;

import com.stockofrigo.backend.model.Product;
import com.stockofrigo.backend.model.ShoppingList;
import com.stockofrigo.backend.model.ShoppingListProduct;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ShoppingListProductRepository extends JpaRepository<ShoppingListProduct, Long> {
  List<ShoppingListProduct> findAllByShoppingList(ShoppingList shoppingList);

  ShoppingListProduct findByShoppingListAndProduct(ShoppingList list, Product product);

  void deleteAllByProductIdIn(List<Long> productIds);
}
