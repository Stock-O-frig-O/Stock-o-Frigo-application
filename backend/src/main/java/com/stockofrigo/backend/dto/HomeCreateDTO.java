package com.stockofrigo.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class HomeCreateDTO {

  @NotBlank(message = "Le nom du home est obligatoire.")
  @Size(max = 50, message = "Le nom du home ne doit pas dépasser 50 caractères.")
  private String name;

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }
}
