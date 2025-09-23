package com.stockofrigo.backend.dto;

import java.util.List;

public class ShoppingListDTO {
  private Long id;
  private String name;
  private Long homeId;
  private List<ShoppingListProductDTO> products;

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public Long getHomeId() {
    return homeId;
  }

  public void setHomeId(Long homeId) {
    this.homeId = homeId;
  }

  public List<ShoppingListProductDTO> getProducts() {
    return products;
  }

  public void setProducts(List<ShoppingListProductDTO> products) {
    this.products = products;
  }
}
