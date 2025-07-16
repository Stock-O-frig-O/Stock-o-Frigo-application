package com.stockofrigo.backend.dto;

import java.util.List;

public class HomeDTO {
  private Long id;
  private String name;
  private List<UserSimpleDTO> users;
  private List<StockProductDTO> stockedProducts;

  public List<StockProductDTO> getStockedProducts() {
    return stockedProducts;
  }

  public void setStockedProducts(List<StockProductDTO> stockedProducts) {
    this.stockedProducts = stockedProducts;
  }

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

  public List<UserSimpleDTO> getUsers() {
    return users;
  }

  public void setUsers(List<UserSimpleDTO> users) {
    this.users = users;
  }
}
