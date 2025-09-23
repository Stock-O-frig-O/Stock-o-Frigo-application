package com.stockofrigo.backend.controller;

import com.stockofrigo.backend.dto.AddShoppingListDTO;
import com.stockofrigo.backend.dto.AddShoppingListProductDTO;
import com.stockofrigo.backend.dto.ShoppingListDTO;
import com.stockofrigo.backend.dto.ShoppingListProductDTO;
import com.stockofrigo.backend.service.ShoppingListService;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/home")
public class ShoppingListController {

  private final ShoppingListService shoppingListService;

  public ShoppingListController(ShoppingListService shoppingListService) {
    this.shoppingListService = shoppingListService;
  }

  @GetMapping("/{homeId}/shopping-lists")
  public ResponseEntity<List<ShoppingListDTO>> getAllShoppingLists(@PathVariable Long homeId) {
    List<ShoppingListDTO> shoppingLists = shoppingListService.getAllShoppingLists(homeId);
    if (shoppingLists.isEmpty()) {
      return ResponseEntity.noContent().build();
    }
    return ResponseEntity.status(HttpStatus.OK).body(shoppingLists);
  }

  @GetMapping("/{homeId}/shopping-lists/{ShoppingListId}")
  public ResponseEntity<ShoppingListDTO> getShoppingList(
      @PathVariable Long homeId, @PathVariable Long ShoppingListId) {
    return ResponseEntity.ok(shoppingListService.getShoppingList(homeId, ShoppingListId));
  }

  @PostMapping("/{homeId}/shopping-lists")
  public ResponseEntity<ShoppingListDTO> createShoppingList(
      @PathVariable Long homeId, @RequestBody AddShoppingListDTO addShoppingListDTO) {
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(shoppingListService.createShoppingList(homeId, addShoppingListDTO.getName()));
  }

  @PatchMapping("/{homeId}/shopping-lists/{ShoppingListId}")
  public ResponseEntity<ShoppingListDTO> updateShoppingList(
      @PathVariable Long homeId,
      @PathVariable Long ShoppingListId,
      @RequestBody AddShoppingListDTO addShoppingListDTO) {
    return ResponseEntity.status(HttpStatus.OK)
        .body(
            shoppingListService.updateShoppingList(
                homeId, ShoppingListId, addShoppingListDTO.getName()));
  }

  @DeleteMapping("/{homeId}/shopping-lists/{ShoppingListId}")
  public ResponseEntity<Void> deleteShoppingList(
      @PathVariable Long homeId, @PathVariable Long ShoppingListId) {
    shoppingListService.deleteShoppingList(homeId, ShoppingListId);
    return ResponseEntity.noContent().build();
  }

  @PostMapping("/{homeId}/shopping-lists/{shoppingListId}/products")
  public ResponseEntity<ShoppingListProductDTO> addProductToList(
      @PathVariable Long homeId,
      @PathVariable Long shoppingListId,
      @RequestBody AddShoppingListProductDTO addShoppingListProductDTO) {
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(
            shoppingListService.addProductToList(
                homeId,
                shoppingListId,
                addShoppingListProductDTO.getProductId(),
                addShoppingListProductDTO.getQuantity(),
                addShoppingListProductDTO.isChecked()));
  }

  @DeleteMapping("/{homeId}/shopping-lists/{shoppingListId}/products/query")
  public ResponseEntity<Void> removeProductFromList(
      @PathVariable Long homeId,
      @PathVariable Long shoppingListId,
      @RequestParam List<Long> productIds) {
    shoppingListService.removeProductFromList(homeId, shoppingListId, productIds);
    return ResponseEntity.noContent().build();
  }
}
