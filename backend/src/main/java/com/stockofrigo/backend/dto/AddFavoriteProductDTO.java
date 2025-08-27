package com.stockofrigo.backend.dto;

import java.math.BigDecimal;

public class AddFavoriteProductDTO {

  Long productId;
  BigDecimal limit;

  public Long getProductId() {
    return productId;
  }

  public void setProductId(Long productId) {
    this.productId = productId;
  }

  public BigDecimal getLimit() {
    return limit;
  }

  public void setLimit(BigDecimal limit) {
    this.limit = limit;
  }
}
