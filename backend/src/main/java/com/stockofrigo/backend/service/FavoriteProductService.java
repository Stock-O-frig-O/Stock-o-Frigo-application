package com.stockofrigo.backend.service;

import com.stockofrigo.backend.dto.FavoriteProductDTO;
import com.stockofrigo.backend.mapper.FavoriteProductMapper;
import com.stockofrigo.backend.model.FavoriteProduct;
import com.stockofrigo.backend.model.Home;
import com.stockofrigo.backend.model.Product;
import com.stockofrigo.backend.repository.FavoriteProductRepository;
import com.stockofrigo.backend.repository.HomeRepository;
import com.stockofrigo.backend.repository.ProductRepository;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
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
    if (favoriteProductRepository.existsByHomeIdAndProductId(homeId, productId)) {
      return null;
    }
    Optional<Home> home = homeRepository.findById(homeId);
    Optional<Product> product = productRepository.findById(productId);
    if (home.isPresent() && product.isPresent()) {
      FavoriteProduct favoriteProduct = new FavoriteProduct();
      favoriteProduct.setHome(home.get());
      favoriteProduct.setProduct(product.get());
      favoriteProduct.setLimit(limit);
      FavoriteProduct saved = favoriteProductRepository.save(favoriteProduct);
      return FavoriteProductMapper.convertToFavoriteProductDto(saved);
    }
    return null;
  }

  public void removeFavoriteProduct(Long Id) {
    favoriteProductRepository.deleteById(Id);
  }

  public List<FavoriteProductDTO> getFavoriteProducts(Long homeId) {
    return favoriteProductRepository.findByHomeId(homeId).stream()
        .map(FavoriteProductMapper::convertToFavoriteProductDto)
        .collect(Collectors.toList());
  }
}
