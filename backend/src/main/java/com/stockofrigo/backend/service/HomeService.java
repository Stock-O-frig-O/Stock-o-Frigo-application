package com.stockofrigo.backend.service;

import com.stockofrigo.backend.dto.AddProductHomeDTO;
import com.stockofrigo.backend.dto.HomeDTO;
import com.stockofrigo.backend.dto.StockProductDTO;
import com.stockofrigo.backend.dto.UserSimpleDTO;
import com.stockofrigo.backend.exception.UserAlreadyInHomeException;
import com.stockofrigo.backend.mapper.HomeMapper;
import com.stockofrigo.backend.mapper.StockProductMapper;
import com.stockofrigo.backend.mapper.UserHomeMapper;
import com.stockofrigo.backend.model.*;
import com.stockofrigo.backend.repository.*;
import jakarta.persistence.EntityNotFoundException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class HomeService {

  private final HomeRepository homeRepository;
  private final UserHomeRepository userHomeRepository;
  private final UserRepository userRepository;
  private final ProductRepository productRepository;
  private final StockProductRepository stockProductRepository;

  private final HomeMapper homeMapper;

  public HomeService(
      HomeRepository homeRepository,
      UserHomeRepository userHomeRepository,
      UserRepository userRepository,
      ProductRepository productRepository,
      StockProductRepository stockProductRepository,
      HomeMapper homeMapper) {
    this.homeRepository = homeRepository;
    this.userHomeRepository = userHomeRepository;
    this.userRepository = userRepository;
    this.productRepository = productRepository;
    this.stockProductRepository = stockProductRepository;
    this.homeMapper = homeMapper;
  }

  public HomeDTO getHomeForUser(User user) {
    Home home =
        homeRepository
            .findFirstByUser(user)
            .orElseThrow(() -> new EntityNotFoundException("Vous n'êtes dans aucun foyer."));
    return homeMapper.convertToHomeDto(home);
  }

  public Home createHomeForUser(String homeName, User user) {
    Optional<Home> checkHomeExist = homeRepository.findFirstByUser(user);
    if (checkHomeExist.isPresent()) {
      throw new UserAlreadyInHomeException("Vous êtes déjà dans un foyer.");
    }

    Home home = new Home();
    home.setName(homeName);
    home = homeRepository.save(home);

    UserHome userHome = new UserHome();
    userHome.setHome(home);
    userHome.setUser(user);
    userHome.setAddedAt(LocalDateTime.now());
    userHomeRepository.save(userHome);

    return home;
  }

  public HomeDTO addUserInHome(Long homeId, String userEmail) {
    Home home =
        homeRepository
            .findById(homeId)
            .orElseThrow(() -> new EntityNotFoundException("Ce home est introuvable."));
    User user =
        userRepository
            .findByEmail(userEmail)
            .orElseThrow(() -> new EntityNotFoundException("Cet utilisateur est introuvable."));

    Optional<Home> checkHomeExist = homeRepository.findFirstByUser(user);
    if (checkHomeExist.isPresent()) {
      throw new UserAlreadyInHomeException("Cet utilisateur est déjà dans un foyer.");
    }

    UserHome userHome = new UserHome();
    userHome.setHome(home);
    userHome.setUser(user);
    userHome.setAddedAt(LocalDateTime.now());
    userHomeRepository.save(userHome);

    return homeMapper.convertToHomeDto(home);
  }

  public List<UserSimpleDTO> getUsersHomeList(Long homeId) {
    Home home =
        homeRepository
            .findById(homeId)
            .orElseThrow(() -> new EntityNotFoundException("Ce home est introuvable."));
    List<UserHome> users = userHomeRepository.findAllByHome(home);
    if (users.isEmpty()) {
      return Collections.emptyList();
    }
    return users.stream().map(UserHomeMapper::convertToUserSimpleDto).collect(Collectors.toList());
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

  public List<StockProductDTO> getHomeProductsList(Long homeId) {
    Home home =
        homeRepository
            .findById(homeId)
            .orElseThrow(() -> new EntityNotFoundException("Ce home est introuvable."));
    List<StockProduct> stockProducts = stockProductRepository.findAllByHome(home);
    if (stockProducts.isEmpty()) {
      return Collections.emptyList();
    }
    return stockProducts.stream()
        .map(StockProductMapper::convertToStockProductDto)
        .collect(Collectors.toList());
  }
}
