package com.stockofrigo.backend.service;

import com.stockofrigo.backend.dto.FavoriteProductDTO;
import com.stockofrigo.backend.mapper.FavoriteProductMapper;
import com.stockofrigo.backend.model.FavoriteProduct;
import com.stockofrigo.backend.model.Home;
import com.stockofrigo.backend.model.Product;
import com.stockofrigo.backend.repository.FavoriteProductRepository;
import com.stockofrigo.backend.repository.HomeRepository;
import com.stockofrigo.backend.repository.ProductRepository;
import jakarta.persistence.EntityNotFoundException;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class FavoriteProductService {

  private final FavoriteProductRepository favoriteProductRepository;
  private final HomeRepository homeRepository;
  private final ProductRepository productRepository;

  public FavoriteProductService(
      FavoriteProductRepository favoriteProductRepository,
      HomeRepository homeRepository,
      ProductRepository productRepository) {
    this.favoriteProductRepository = favoriteProductRepository;
    this.homeRepository = homeRepository;
    this.productRepository = productRepository;
  }

  public FavoriteProductDTO addFavoriteProduct(Long homeId, Long productId, BigDecimal limit) {
    Home home =
        homeRepository
            .findById(homeId)
            .orElseThrow(() -> new EntityNotFoundException("Ce home est introuvable."));
    Product product =
        productRepository
            .findById(productId)
            .orElseThrow(() -> new EntityNotFoundException("Ce produit est introuvable."));
    List<FavoriteProduct> existingFavorites = favoriteProductRepository.findByHomeId(homeId);
    for (FavoriteProduct fav : existingFavorites) {
      if (fav.getProduct().getId().equals(productId)) {
        fav.setLimit(limit);
        FavoriteProduct updated = favoriteProductRepository.save(fav);
        return FavoriteProductMapper.convertToFavoriteProductDto(updated);
      }
    }
    FavoriteProduct favoriteProduct = new FavoriteProduct();
    favoriteProduct.setHome(home);
    favoriteProduct.setProduct(product);
    favoriteProduct.setLimit(limit);
    FavoriteProduct saved = favoriteProductRepository.save(favoriteProduct);
    return FavoriteProductMapper.convertToFavoriteProductDto(saved);
  }

  public void removeFavoriteProductByHomeAndProducts(Long homeId, List<Long> productIds) {
    List<FavoriteProduct> products =
        favoriteProductRepository.findAllByHomeIdAndProductIdIn(homeId, productIds);
    if (products.isEmpty()) {
      throw new EntityNotFoundException("Aucun favori n'existe pour ce home et ces produits.");
    }
    favoriteProductRepository.deleteAll(products);
  }

  public List<FavoriteProductDTO> getFavoriteProducts(Long homeId) {
    return favoriteProductRepository.findByHomeId(homeId).stream()
        .map(FavoriteProductMapper::convertToFavoriteProductDto)
        .collect(Collectors.toList());
  }
}
