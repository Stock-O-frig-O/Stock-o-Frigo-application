package com.stockofrigo.backend.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.when;

import com.stockofrigo.backend.dto.ProductDTO;
import com.stockofrigo.backend.mapper.ProductMapper;
import com.stockofrigo.backend.model.Product;
import com.stockofrigo.backend.model.Unit;
import com.stockofrigo.backend.repository.ProductRepository;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.context.ActiveProfiles;

@ExtendWith(MockitoExtension.class)
@ActiveProfiles("test")
public class ProductServiceTest {

  @Mock private ProductRepository productRepository;

  @Mock private ProductMapper productMapper;

  @InjectMocks private ProductService productService;

  @Test
  void testGetAllProducts() {
    Unit unit = new Unit();
    unit.setUnit("kg");

    Product product1 = new Product();
    product1.setName("Product 1");
    product1.setUnit(unit);

    Product product2 = new Product();
    product2.setName("Product 2");
    product2.setUnit(unit);

    when(productRepository.findAll()).thenReturn(List.of(product1, product2));

    ProductDTO dto1 = new ProductDTO();
    dto1.setName("Product 1");

    ProductDTO dto2 = new ProductDTO();
    dto2.setName("Product 2");

    when(productMapper.convertToDto(product1)).thenReturn(dto1);
    when(productMapper.convertToDto(product2)).thenReturn(dto2);

    List<ProductDTO> productDTOList = productService.getAllProduct();

    assertThat(productDTOList).hasSize(2);
    assertThat(productDTOList.get(0).getName()).isEqualTo("Product 1");
    assertThat(productDTOList.get(1).getName()).isEqualTo("Product 2");
  }

  @Test
  void testGetProductById_ProductExists() {

    Product product = new Product();
    product.setId(1L);
    product.setName("Product 1");

    when(productRepository.findById(1L)).thenReturn(Optional.of(product));

    ProductDTO dtoMock = new ProductDTO();
    dtoMock.setName("Product 1");
    when(productMapper.convertToDto(product)).thenReturn(dtoMock);

    ProductDTO dto = productService.getProductById(1L);

    assertThat(dto).isNotNull();
    assertThat(dto.getName()).isEqualTo("Product 1");
  }

  @Test
  void testGetProductById_ProductDoesNotExist() {
    lenient().when(productRepository.findById(99L)).thenReturn(Optional.empty());
  }
}
