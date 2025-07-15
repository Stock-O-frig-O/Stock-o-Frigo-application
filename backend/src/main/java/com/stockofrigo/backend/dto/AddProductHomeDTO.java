package com.stockofrigo.backend.dto;

import java.math.BigDecimal;

public class AddProductHomeDTO {

  Long productId;
  BigDecimal quantity;

  public Long getProductId() {
    return productId;
  }

  public void setProductId(Long productId) {
    this.productId = productId;
  }

  public BigDecimal getQuantity() {
    return quantity;
  }

  public void setQuantity(BigDecimal quantity) {
    this.quantity = quantity;
  }
}
