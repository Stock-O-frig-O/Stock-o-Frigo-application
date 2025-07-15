package com.stockofrigo.backend.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class Home {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, length = 50)
  private String name;

  @OneToMany(mappedBy = "home")
  private List<UserHome> userHomes;

  @OneToMany(mappedBy = "home")
  private List<StockProduct> stockProducts;

  public List<StockProduct> getStockProducts() {
    return stockProducts;
  }

  public void setStockProducts(List<StockProduct> stockProducts) {
    this.stockProducts = stockProducts;
  }

  public List<UserHome> getUserHomes() {
    return userHomes;
  }

  public void setUserHomes(List<UserHome> userHomes) {
    this.userHomes = userHomes;
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
}
