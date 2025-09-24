package com.stockofrigo.backend.dto;

import java.math.BigDecimal;

public class AddShoppingListProductDTO {

  private Long productId;
  private BigDecimal quantity;
  private boolean checked;

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

  public boolean isChecked() {
    return checked;
  }

  public void setChecked(boolean checked) {
    this.checked = checked;
  }
}
