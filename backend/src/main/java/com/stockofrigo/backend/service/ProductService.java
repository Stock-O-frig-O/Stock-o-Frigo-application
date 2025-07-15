package com.stockofrigo.backend.service;

import com.stockofrigo.backend.dto.ProductDTO;
import com.stockofrigo.backend.mapper.ProductMapper;
import com.stockofrigo.backend.model.Category;
import com.stockofrigo.backend.model.Product;
import com.stockofrigo.backend.model.Unit;
import com.stockofrigo.backend.repository.CategoryRepository;
import com.stockofrigo.backend.repository.ProductRepository;
import com.stockofrigo.backend.repository.UnitRepository;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class ProductService {

  private ProductRepository productRepository;
  private UnitRepository unitRepository;
  private CategoryRepository categoryRepository;

  public ProductService(ProductRepository productRepository, UnitRepository unitRepository, CategoryRepository categoryRepository) {
    this.productRepository = productRepository;
    this.unitRepository = unitRepository;
    this.categoryRepository = categoryRepository;
  }

  public List<ProductDTO> getAllProduct() {
    List<Product> products = this.productRepository.findAll();
    if (products.isEmpty()) {
      return Collections.emptyList();
    }
    return products.stream().map(ProductMapper.INSTANCE::convertToDto).collect(Collectors.toList());
  }

  public ProductDTO getProductById(Long id) {
    Product product = this.productRepository.findById(id).orElse(null);
    if (product == null) {
      return null;
    }
    return ProductMapper.INSTANCE.convertToDto(product);
  }

  public List<ProductDTO> getProductsFiltered(String query){
    List<Product> products = this.productRepository.findAll();
    List<Product> filterdedPoducts = products.stream()
            .filter(product -> product.getName().contains(query)).toList();
    if (products.isEmpty()){
      return Collections.emptyList();
    }
    return filterdedPoducts.stream().map(ProductMapper.INSTANCE::convertToDto).collect((Collectors.toList()));
  }

  public ProductDTO updateProduct(Long id, Product product) {
    Product updatedProduct = productRepository.findById(id).orElse(null);
    if (updatedProduct == null) {
      return null;
    }
    updatedProduct.setName(product.getName());
    updatedProduct.setBarcode(product.getBarcode());
    updatedProduct.setBrand(product.getBrand());
    updatedProduct.setImageUrl(product.getImageUrl());
    updatedProduct.setIngredient(product.isIngredient());
    updatedProduct.setUpdatedAt(LocalDateTime.now());
    if(product.getCategory() != null){
      Category category = categoryRepository.findById(product.getCategory().getId()).orElse(null);
      if (category == null) {
        return null;
      }
      updatedProduct.setCategory(category);
    }
    if (product.getUnit() != null) {
      Unit unit = unitRepository.findById(product.getUnit().getId()).orElse(null);
      if (unit == null) {
        return null;
      }
      updatedProduct.setUnit(unit);
    }
    Product savedProduct = productRepository.save(updatedProduct);
    return ProductMapper.INSTANCE.convertToDto(savedProduct);
  }

  public ProductDTO createProduct(Product product) {
    Product savedProduct = new Product();
    savedProduct.setName(product.getName());
    savedProduct.setBarcode(product.getBarcode());
    savedProduct.setBrand(product.getBrand());
    savedProduct.setCreatedAt(LocalDateTime.now());
    savedProduct.setImageUrl(product.getImageUrl());
    savedProduct.setIngredient(product.isIngredient());

    if(product.getCategory() != null){
      Category category = categoryRepository.findById(product.getCategory().getId()).orElse(null);
      if (category == null) {
        return null;
      }
      savedProduct.setCategory(category);
    }

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
