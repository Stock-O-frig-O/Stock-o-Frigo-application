package com.stockofrigo.backend.controller;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.stockofrigo.backend.dto.ProductDTO;
import com.stockofrigo.backend.security.JwtService;
import com.stockofrigo.backend.service.ProductService;
import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(ProductController.class)
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("test")
public class ProductControllerTest {

  @Autowired private MockMvc mockMvc;

  @MockBean private ProductService productService;

  @MockBean private JwtService jwtService;

  @Test
  void testGetAllProducts() throws Exception {
    ProductDTO productDTO1 = new ProductDTO();
    productDTO1.setName("Product 1");

    ProductDTO productDTO2 = new ProductDTO();
    productDTO2.setName("Product 2");

    when(productService.getAllProduct()).thenReturn(List.of(productDTO1, productDTO2));

    mockMvc
        .perform(get("/products"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.length()").value(2))
        .andExpect(jsonPath("$[0].name").value("Product 1"))
        .andExpect(jsonPath("$[1].name").value("Product 2"));
  }

  @Test
  void testGetProductById_ProductExists() throws Exception {
    // Arrange
    ProductDTO productDTO = new ProductDTO();
    productDTO.setName("Product 1");

    when(productService.getProductById(1L)).thenReturn(productDTO);

    mockMvc
        .perform(get("/products/1"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.name").value("Product 1"));
  }

  @Test
  void testGetProductById_ProductNotFound() throws Exception {
    when(productService.getProductById(99L))
        .thenThrow(new EntityNotFoundException("Category not found"));

    mockMvc.perform(get("/products/99")).andExpect(status().isNotFound());
  }
}
