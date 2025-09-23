package com.stockofrigo.backend.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class ShoppingList {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String name;

  @ManyToOne
  @JoinColumn(name = "home_id", nullable = false)
  private Home home;

  @OneToMany(mappedBy = "shoppingList", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<ShoppingListProduct> products;

  // Getters and setters
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

  public Home getHome() {
    return home;
  }

  public void setHome(Home home) {
    this.home = home;
  }

  public List<ShoppingListProduct> getProducts() {
    return products;
  }

  public void setProducts(List<ShoppingListProduct> products) {
    this.products = products;
  }
}
