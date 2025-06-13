package com.stockofrigo.backend.controller;

import com.stockofrigo.backend.dto.ProductDTO;
import com.stockofrigo.backend.model.Product;
import com.stockofrigo.backend.service.ProductService;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/products")
public class ProductController {

  private ProductService productService;

  public ProductController(ProductService productService) {
    this.productService = productService;
  }

  @GetMapping
  public ResponseEntity<List<ProductDTO>> getAllProduct() {
    List<ProductDTO> products = this.productService.getAllProduct();

    if (products == null) {
      return ResponseEntity.notFound().build();
    }

    return ResponseEntity.ok(products);
  }

  @GetMapping("/{id}")
  public ResponseEntity<ProductDTO> getOneProductById(@PathVariable Long id) {
    ProductDTO product = this.productService.getProductById(id);

    if (product == null) {
      return ResponseEntity.noContent().build();
    }
    return ResponseEntity.ok(product);
  }

  @PostMapping
  public ResponseEntity<ProductDTO> createProduct(@RequestBody Product newProduct) {
    ProductDTO savedProduct = this.productService.createProduct(newProduct);
    return ResponseEntity.status(HttpStatus.CREATED).body(savedProduct);
  }
}
