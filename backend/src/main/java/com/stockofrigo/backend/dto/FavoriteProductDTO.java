package com.stockofrigo.backend.dto;

import java.math.BigDecimal;

public class FavoriteProductDTO {
  private Long id;
  private Long productId;
  private String name;
  private String brand;
  private String unit;
  private String category;
  private BigDecimal limit;
  private Long homeId;

  public BigDecimal getLimit() {
    return limit;
  }

  public void setLimit(BigDecimal limit) {
    this.limit = limit;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Long getProductId() {
    return productId;
  }

  public void setProductId(Long productId) {
    this.productId = productId;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getBrand() {
    return brand;
  }

  public void setBrand(String brand) {
    this.brand = brand;
  }

  public String getUnit() {
    return unit;
  }

  public void setUnit(String unit) {
    this.unit = unit;
  }

  public String getCategory() {
    return category;
  }

  public void setCategory(String category) {
    this.category = category;
  }

  public Long getHomeId() {
    return homeId;
  }

  public void setHomeId(Long homeId) {
    this.homeId = homeId;
  }
}
