package com.stockofrigo.backend.service;

import com.stockofrigo.backend.dto.AddProductHomeDTO;
import com.stockofrigo.backend.dto.HomeDTO;
import com.stockofrigo.backend.exception.UserAlreadyInHomeException;
import com.stockofrigo.backend.mapper.HomeMapper;
import com.stockofrigo.backend.model.*;
import com.stockofrigo.backend.repository.*;
import jakarta.persistence.EntityNotFoundException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class HomeService {

  @Autowired HomeRepository homeRepository;
  @Autowired UserHomeRepository userHomeRepository;
  @Autowired UserRepository userRepository;
  @Autowired ProductRepository productRepository;
  @Autowired StockProductRepository stockProductRepository;

  @Autowired HomeMapper homeMapper;

  public List<HomeDTO> getHomesForUser(User user) {
    List<Home> homes = homeRepository.findHomesByUser(user);
    if (homes.isEmpty()) {
      return Collections.emptyList();
    }
    return homes.stream().map(HomeMapper.INSTANCE::convertToHomeDto).collect(Collectors.toList());
  }

  public Home createHomeForUser(String homeName, User user) {
    // 1. Créer le Home
    Home home = new Home();
    home.setName(homeName);
    home = homeRepository.save(home);

    // 2. Créer le lien UserHome
    UserHome userHome = new UserHome();
    userHome.setHome(home);
    userHome.setUser(user);
    userHome.setAddedAt(LocalDateTime.now());
    userHomeRepository.save(userHome);

    return home;
  }

  public HomeDTO addUserInHome(Long homeId, Long userId) {
    Home home =
        homeRepository
            .findById(homeId)
            .orElseThrow(() -> new EntityNotFoundException("Ce home est introuvable."));
    User user =
        userRepository
            .findById(userId)
            .orElseThrow(() -> new EntityNotFoundException("Cet utilisateur est introuvable."));

    UserHome checkUserHomeExist = userHomeRepository.findByUserAndHome(user, home);
    if (checkUserHomeExist != null) {
      throw new UserAlreadyInHomeException("Cet utilisateur est déjà associé à ce home.");
    }

    UserHome userHome = new UserHome();
    userHome.setHome(home);
    userHome.setUser(user);
    userHome.setAddedAt(LocalDateTime.now());
    userHomeRepository.save(userHome);

    return homeMapper.convertToHomeDto(home);
  }

  public HomeDTO deleteUserFromHome(Long homeId, Long userId) {
    Home home =
        homeRepository
            .findById(homeId)
            .orElseThrow(() -> new EntityNotFoundException("Ce home est introuvable."));
    User user =
        userRepository
            .findById(userId)
            .orElseThrow(() -> new EntityNotFoundException("Cet utilisateur est introuvable."));

    UserHome userHome = userHomeRepository.findByUserAndHome(user, home);
    if (userHome != null) {
      userHomeRepository.delete(userHome);
    }

    return homeMapper.convertToHomeDto(home);
  }

  public HomeDTO updateProductQuantity(Long homeId, Long stockProductId, BigDecimal quantity) {
    Home home =
        homeRepository
            .findById(homeId)
            .orElseThrow(() -> new EntityNotFoundException("Ce home est introuvable."));
    StockProduct stockProduct =
        stockProductRepository
            .findById(stockProductId)
            .orElseThrow(() -> new EntityNotFoundException("Ce produit stocké est introuvable."));

    stockProduct.setQuantity(quantity);
    stockProductRepository.save(stockProduct);

    return homeMapper.convertToHomeDto(home);
  }

  public HomeDTO deleteProductFromStock(Long homeId, Long stockProductId) {
    Home home =
        homeRepository
            .findById(homeId)
            .orElseThrow(() -> new EntityNotFoundException("Ce home est introuvable."));

    StockProduct stockProduct =
        stockProductRepository
            .findById(stockProductId)
            .orElseThrow(() -> new EntityNotFoundException("Ce produit stocké est introuvable."));

    stockProductRepository.delete(stockProduct);
    return homeMapper.convertToHomeDto(home);
  }

  public HomeDTO addProductToStock(Long homeId, AddProductHomeDTO addProductHomeDTO) {
    Home home =
        homeRepository
            .findById(homeId)
            .orElseThrow(() -> new EntityNotFoundException("Ce home est introuvable."));
    Product product =
        productRepository
            .findById(addProductHomeDTO.getProductId())
            .orElseThrow(() -> new EntityNotFoundException("Ce produit est introuvable."));

    // Vérifier si la relation existe déjà
    StockProduct existing =
        home.getStockProducts().stream()
            .filter(sp -> sp.getProduct().getId().equals(product.getId()))
            .findFirst()
            .orElse(null);
    if (existing != null) {
      // Met à jour la quantité
      existing.setQuantity(addProductHomeDTO.getQuantity());
      stockProductRepository.save(existing);
    } else {
      // Crée la relation
      StockProduct stockProduct = new StockProduct();
      stockProduct.setProduct(product);
      stockProduct.setQuantity(addProductHomeDTO.getQuantity());
      stockProduct.setHome(home);
      stockProductRepository.save(stockProduct);
    }
    return homeMapper.convertToHomeDto(home);
  }
}
