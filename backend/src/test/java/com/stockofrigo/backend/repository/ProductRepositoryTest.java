package com.stockofrigo.backend.repository;

import static org.assertj.core.api.Assertions.assertThat;

import com.stockofrigo.backend.model.Product;
import com.stockofrigo.backend.model.Unit;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE) // IGNORING SQL FILE
@TestPropertySource(properties = "spring.sql.init.mode=never") // IGNORING SQL FILE
@ActiveProfiles("test")
public class ProductRepositoryTest {

  @Autowired private ProductRepository productRepository;

  @Autowired private UnitRepository unitRepository;

  @Test
  void testSaveAndFindProductById() {
    Unit unit = new Unit();
    unit.setUnit("kg");
    Unit savedUnit = unitRepository.save(unit);

    Product product = new Product();
    product.setName("Carrot");
    product.setUnit(savedUnit);
    Product savedProduct = productRepository.save(product);

    Product found = productRepository.findById(savedProduct.getId()).orElse(null);
    assertThat(found).isNotNull();
    assertThat(found.getName()).isEqualTo("Carrot");
    assertThat(found.getUnit().getUnit()).isEqualTo("kg");
  }

  @Test
  void testFindAllProducts() {
    Unit unit = new Unit();
    unit.setUnit("kg");
    Unit savedUnit = unitRepository.save(unit);

    Product product1 = new Product();
    product1.setName("Product 1");
    product1.setUnit(savedUnit);

    Product product2 = new Product();
    product2.setName("Product 2");
    product2.setUnit(savedUnit);

    productRepository.saveAll(List.of(product1, product2));

    List<Product> products = productRepository.findAll();
    assertThat(products).hasSize(2);
    assertThat(products.stream().anyMatch(p -> p.getName().equals("Product 1"))).isTrue();
    assertThat(products.stream().anyMatch(p -> p.getName().equals("Product 2"))).isTrue();
  }

  @Test
  void testUpdateProduct() {
    Unit unit = new Unit();
    unit.setUnit("kg");
    Unit savedUnit = unitRepository.save(unit);

    Product product = new Product();
    product.setName("Apple");
    product.setUnit(savedUnit);
    Product savedProduct = productRepository.save(product);

    savedProduct.setName("Green Apple");
    productRepository.save(savedProduct);

    Product updated = productRepository.findById(savedProduct.getId()).orElse(null);
    assertThat(updated).isNotNull();
    assertThat(updated.getName()).isEqualTo("Green Apple");
  }

  @Test
  void testDeleteProduct() {
    Unit unit = new Unit();
    unit.setUnit("kg");
    Unit savedUnit = unitRepository.save(unit);

    Product product = new Product();
    product.setName("Banana");
    product.setUnit(savedUnit);
    Product savedProduct = productRepository.save(product);

    productRepository.delete(savedProduct);
    Product deleted = productRepository.findById(savedProduct.getId()).orElse(null);
    assertThat(deleted).isNull();
  }
}
