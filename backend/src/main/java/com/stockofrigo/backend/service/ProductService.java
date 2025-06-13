package com.stockofrigo.backend.service;

import com.stockofrigo.backend.dto.ProductDTO;
import com.stockofrigo.backend.mapper.ProductMapper;
import com.stockofrigo.backend.model.Product;
import com.stockofrigo.backend.model.Unit;
import com.stockofrigo.backend.repository.ProductRepository;
import com.stockofrigo.backend.repository.UnitRepository;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class ProductService {

  private ProductRepository productRepository;
  private UnitRepository unitRepository;

  public ProductService(ProductRepository productRepository, UnitRepository unitRepository) {
    this.productRepository = productRepository;
    this.unitRepository = unitRepository;
  }

  public List<ProductDTO> getAllProduct() {
    List<Product> Products = this.productRepository.findAll();
    if (Products.isEmpty()) {
      return Collections.emptyList();
    }
    return Products.stream().map(ProductMapper.INSTANCE::convertToDto).collect(Collectors.toList());
  }

  public ProductDTO getProductById(Long id) {
    Product product = this.productRepository.findById(id).orElse(null);
    if (product == null) {
      return null;
    }
    return ProductMapper.INSTANCE.convertToDto(product);
  }

  public ProductDTO createProduct(Product product) {
    Product savedProduct = new Product();
    savedProduct.setBarcode(product.getBarcode());
    savedProduct.setBrand(product.getBrand());
    savedProduct.setCreatedAt(LocalDateTime.now());
    savedProduct.setImageUrl(product.getImageUrl());
    savedProduct.setIngredient(product.isIngredient());

    if (product.getUnit() != null) {
      Unit unit = unitRepository.findById(product.getUnit().getId()).orElse(null);
      if (unit == null) {
        return null;
      }
      savedProduct.setUnit(unit);
    }

    Product newProduct = productRepository.save(savedProduct);

    return ProductMapper.INSTANCE.convertToDto(newProduct);
  }
}
