package com.stockofrigo.backend.controller;

import com.stockofrigo.backend.dto.*;
import com.stockofrigo.backend.model.Home;
import com.stockofrigo.backend.model.User;
import com.stockofrigo.backend.service.HomeService;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/home")
public class HomeController {

  private final HomeService homeService;

  public HomeController(HomeService homeService) {
    this.homeService = homeService;
  }

  @GetMapping
  public ResponseEntity<HomeDTO> getUserHome(@AuthenticationPrincipal User currentUser) {
    HomeDTO home = homeService.getHomeForUser(currentUser);
    return ResponseEntity.ok(home);
  }

  @PostMapping
  public ResponseEntity<Home> createHome(
      @RequestBody HomeCreateDTO homeCreateDTO, @AuthenticationPrincipal User currentUser) {
    Home createdHome = homeService.createHomeForUser(homeCreateDTO.getName(), currentUser);
    return ResponseEntity.status(HttpStatus.CREATED).body(createdHome);
  }

  @GetMapping("/{homeId}/users")
  public ResponseEntity<List<UserSimpleDTO>> getUsersHomeList(@PathVariable Long homeId) {
    List<UserSimpleDTO> users = homeService.getUsersHomeList(homeId);
    if (users.isEmpty()) {
      return ResponseEntity.noContent().build();
    }
    return ResponseEntity.status(HttpStatus.OK).body(users);
  }

  @PostMapping("/{homeId}/users")
  public ResponseEntity<HomeDTO> addUserInHome(
      @RequestBody UserEmailDTO userEmail, @PathVariable Long homeId) {
    HomeDTO homeDTO = homeService.addUserInHome(homeId, userEmail.getUserEmail());
    return ResponseEntity.status(HttpStatus.CREATED).body(homeDTO);
  }

  @DeleteMapping("/{homeId}/users/{userId}")
  public ResponseEntity<HomeDTO> deleteUserFromHome(
      @PathVariable Long homeId, @PathVariable Long userId) {
    HomeDTO homeDTO = homeService.deleteUserFromHome(homeId, userId);
    return ResponseEntity.status(HttpStatus.NO_CONTENT).body(homeDTO);
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

  @PostMapping("/{homeId}/products")
  public ResponseEntity<HomeDTO> addProductToStock(
      @PathVariable Long homeId, @RequestBody AddProductHomeDTO addProductHomeDTO) {
    HomeDTO homeDTO = homeService.addProductToStock(homeId, addProductHomeDTO);
    return ResponseEntity.status(HttpStatus.CREATED).body(homeDTO);
  }

  @GetMapping("/{homeId}/products")
  public ResponseEntity<List<StockProductDTO>> getHomeProductsList(@PathVariable Long homeId) {
    List<StockProductDTO> producs = homeService.getHomeProductsList(homeId);
    if (producs.isEmpty()) {
      return ResponseEntity.noContent().build();
    }
    return ResponseEntity.status(HttpStatus.OK).body(producs);
  }
}
