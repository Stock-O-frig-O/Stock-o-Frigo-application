package com.stockofrigo.backend.dto;

import java.math.BigDecimal;

public class ChangeQuantityProductHomeDTO {
  BigDecimal quantity;

  public BigDecimal getQuantity() {
    return quantity;
  }

  public void setQuantity(BigDecimal quantity) {
    this.quantity = quantity;
  }
}
