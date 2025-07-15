package com.stockofrigo.backend.service;

import com.stockofrigo.backend.dto.HomeDTO;
import com.stockofrigo.backend.exception.UserAlreadyInHomeException;
import com.stockofrigo.backend.mapper.HomeMapper;
import com.stockofrigo.backend.model.Home;
import com.stockofrigo.backend.model.User;
import com.stockofrigo.backend.model.UserHome;
import com.stockofrigo.backend.repository.HomeRepository;
import com.stockofrigo.backend.repository.UserHomeRepository;
import com.stockofrigo.backend.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
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

  // Met à jour la quantité d'un produit stocké dans un home
  public HomeDTO updateProductQuantity(
      Long homeId, Long stockProductId, java.math.BigDecimal quantity) {
    Home home =
        homeRepository
            .findById(homeId)
            .orElseThrow(() -> new EntityNotFoundException("Ce home est introuvable."));
    var stockProductOpt =
        home.getStockProducts().stream()
            .filter(sp -> sp.getId().equals(stockProductId))
            .findFirst();
    if (stockProductOpt.isEmpty())
      throw new EntityNotFoundException("Produit stocké introuvable dans ce home.");
    var stockProduct = stockProductOpt.get();
    stockProduct.setQuantity(quantity);
    homeRepository.save(home);
    return homeMapper.convertToHomeDto(home);
  }

  // Supprime un produit du stock d'un home
  public HomeDTO deleteProductFromStock(Long homeId, Long stockProductId) {
    Home home =
        homeRepository
            .findById(homeId)
            .orElseThrow(() -> new EntityNotFoundException("Ce home est introuvable."));
    var stockProducts = home.getStockProducts();
    boolean removed = stockProducts.removeIf(sp -> sp.getId().equals(stockProductId));
    if (!removed) throw new EntityNotFoundException("Produit stocké introuvable dans ce home.");
    homeRepository.save(home);
    return homeMapper.convertToHomeDto(home);
  }
}
