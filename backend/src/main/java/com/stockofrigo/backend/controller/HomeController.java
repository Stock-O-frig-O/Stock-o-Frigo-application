package com.stockofrigo.backend.controller;

import com.stockofrigo.backend.dto.*;
import com.stockofrigo.backend.model.Home;
import com.stockofrigo.backend.model.User;
import com.stockofrigo.backend.service.HomeService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/home")
public class HomeController {

  @Autowired private HomeService homeService;

  @GetMapping
  public ResponseEntity<List<HomeDTO>> getUserHomes(@AuthenticationPrincipal User currentUser) {
    List<HomeDTO> homes = homeService.getHomesForUser(currentUser);
    return ResponseEntity.ok(homes);
  }

  @PostMapping
  public ResponseEntity<Home> createHome(
      @RequestBody HomeCreateDTO homeCreateDTO, @AuthenticationPrincipal User currentUser) {
    Home createdHome = homeService.createHomeForUser(homeCreateDTO.getName(), currentUser);
    return ResponseEntity.status(HttpStatus.CREATED).body(createdHome);
  }

  @PostMapping("/{homeId}/users")
  public ResponseEntity<HomeDTO> addUserInHome(
      @RequestBody UserIdDTO userId, @PathVariable Long homeId) {
    HomeDTO homeDTO = homeService.addUserInHome(homeId, userId.getUserId());
    return ResponseEntity.status(HttpStatus.OK).body(homeDTO);
  }

  @DeleteMapping("/{homeId}/users/{userId}")
  public ResponseEntity<HomeDTO> deleteUserFromHome(
      @PathVariable Long homeId, @PathVariable Long userId) {
    HomeDTO homeDTO = homeService.deleteUserFromHome(homeId, userId);
    return ResponseEntity.status(HttpStatus.OK).body(homeDTO);
  }

  // Stocked products CRUD
  @PutMapping("/{homeId}/products/{stockProductId}")
  public ResponseEntity<HomeDTO> updateProductQuantity(
      @PathVariable Long homeId,
      @PathVariable Long stockProductId,
      @RequestBody ChangeQuantityProductHomeDTO changeQuantityProductHomeDTO) {
    HomeDTO homeDTO =
        homeService.updateProductQuantity(
            homeId, stockProductId, changeQuantityProductHomeDTO.getQuantity());
    return ResponseEntity.ok(homeDTO);
  }

  @DeleteMapping("/{homeId}/products/{stockProductId}")
  public ResponseEntity<HomeDTO> deleteProductFromStock(
      @PathVariable Long homeId, @PathVariable Long stockProductId) {
    HomeDTO homeDTO = homeService.deleteProductFromStock(homeId, stockProductId);
    return ResponseEntity.ok(homeDTO);
  }

  // Ajoute un produit au stock d'un home
  @PostMapping("/{homeId}/products")
  public ResponseEntity<HomeDTO> addProductToStock(
      @PathVariable Long homeId, @RequestBody AddProductHomeDTO addProductHomeDTO) {
    HomeDTO homeDTO = homeService.addProductToStock(homeId, addProductHomeDTO);
    return ResponseEntity.status(HttpStatus.CREATED).body(homeDTO);
  }
}
