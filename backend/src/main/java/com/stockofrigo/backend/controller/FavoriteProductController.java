package com.stockofrigo.backend.controller;

import com.stockofrigo.backend.dto.AddFavoriteProductDTO;
import com.stockofrigo.backend.dto.FavoriteProductDTO;
import com.stockofrigo.backend.service.FavoriteProductService;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/homes")
public class FavoriteProductController {

  private final FavoriteProductService favoriteProductService;

  public FavoriteProductController(FavoriteProductService favoriteProductService) {
    this.favoriteProductService = favoriteProductService;
  }

  // Delete favorite product from home
  @DeleteMapping("/{homeId}/favorites/{productId}")
  public ResponseEntity<Void> removeFavoriteProduct(
      @PathVariable Long homeId, @PathVariable Long productId) {
    favoriteProductService.removeFavoriteProductByHomeAndProduct(homeId, productId);
    return ResponseEntity.noContent().build();
  }

  // Add favorite product to home
  @PostMapping("/{homeId}/favorites")
  public ResponseEntity<FavoriteProductDTO> addFavoriteProduct(
      @PathVariable Long homeId, @RequestBody AddFavoriteProductDTO addFavoriteProductDTO) {
    FavoriteProductDTO dto =
        favoriteProductService.addFavoriteProduct(
            homeId, addFavoriteProductDTO.getProductId(), addFavoriteProductDTO.getLimit());
    if (dto == null) {
      return ResponseEntity.status(HttpStatus.CONFLICT).build();
    }
    return ResponseEntity.status(HttpStatus.CREATED).body(dto);
  }

  // List all favorite products for a home
  @GetMapping("/{homeId}/favorites")
  public ResponseEntity<List<FavoriteProductDTO>> getFavoritesProducts(@PathVariable Long homeId) {
    List<FavoriteProductDTO> favorites = favoriteProductService.getFavoriteProducts(homeId);
    if (favorites.isEmpty()) {
      return ResponseEntity.noContent().build();
    }
    return ResponseEntity.status(HttpStatus.OK).body(favorites);
  }
}
