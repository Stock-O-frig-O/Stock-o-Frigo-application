package com.stockofrigo.backend.mapper;

import com.stockofrigo.backend.dto.ShoppingListDTO;
import com.stockofrigo.backend.dto.ShoppingListProductDTO;
import com.stockofrigo.backend.model.ShoppingList;
import com.stockofrigo.backend.model.ShoppingListProduct;
import java.util.stream.Collectors;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ShoppingListMapper {

  static ShoppingListProductDTO convertShoppingListProductToDto(
      ShoppingListProduct shoppingListProduct) {
    ShoppingListProductDTO shoppingListProductDTO = new ShoppingListProductDTO();
    shoppingListProductDTO.setId(shoppingListProduct.getId());
    shoppingListProductDTO.setQuantity(shoppingListProduct.getQuantity());
    shoppingListProductDTO.setChecked(shoppingListProduct.isChecked());
    shoppingListProductDTO.setProductId(shoppingListProduct.getProduct().getId());
    shoppingListProductDTO.setProductName(shoppingListProduct.getProduct().getName());
    return shoppingListProductDTO;
  }

  static ShoppingListDTO convertToDto(ShoppingList list) {
    ShoppingListDTO shoppingListDTO = new ShoppingListDTO();
    shoppingListDTO.setId(list.getId());
    shoppingListDTO.setName(list.getName());
    shoppingListDTO.setHomeId(list.getHome().getId());
    if (list.getProducts() != null) {
      shoppingListDTO.setProducts(
          list.getProducts().stream()
              .map(ShoppingListMapper::convertShoppingListProductToDto)
              .collect(Collectors.toList()));
    }
    return shoppingListDTO;
  }
}
