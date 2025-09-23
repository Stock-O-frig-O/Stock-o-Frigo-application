package com.stockofrigo.backend.service;

import com.stockofrigo.backend.dto.ShoppingListDTO;
import com.stockofrigo.backend.dto.ShoppingListProductDTO;
import com.stockofrigo.backend.mapper.ShoppingListMapper;
import com.stockofrigo.backend.model.*;
import com.stockofrigo.backend.repository.*;
import jakarta.persistence.EntityNotFoundException;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ShoppingListService {
  private final ShoppingListRepository shoppingListRepository;
  private final ShoppingListProductRepository shoppingListProductRepository;
  private final HomeRepository homeRepository;
  private final ProductRepository productRepository;

  public ShoppingListService(
      ShoppingListRepository shoppingListRepository,
      ShoppingListProductRepository shoppingListProductRepository,
      HomeRepository homeRepository,
      ProductRepository productRepository) {
    this.shoppingListRepository = shoppingListRepository;
    this.shoppingListProductRepository = shoppingListProductRepository;
    this.homeRepository = homeRepository;
    this.productRepository = productRepository;
  }

  public List<ShoppingListDTO> getAllShoppingLists(Long homeId) {
    return shoppingListRepository.findByHomeId(homeId).stream()
        .map(ShoppingListMapper::convertToDto)
        .collect(Collectors.toList());
  }

  public ShoppingListDTO getShoppingList(Long homeId, Long id) {
    Home home =
        homeRepository
            .findById(homeId)
            .orElseThrow(() -> new EntityNotFoundException("Home non trouvé"));
    ShoppingList list =
        shoppingListRepository
            .findByIdAndHome(id, home)
            .orElseThrow(() -> new EntityNotFoundException("Liste non trouvée"));
    return ShoppingListMapper.convertToDto(list);
  }

  public ShoppingListDTO createShoppingList(Long homeId, String name) {
    Home home =
        homeRepository
            .findById(homeId)
            .orElseThrow(() -> new EntityNotFoundException("Home non trouvé"));
    ShoppingList list = new ShoppingList();
    list.setName(name);
    list.setHome(home);
    list = shoppingListRepository.save(list);
    return ShoppingListMapper.convertToDto(list);
  }

  public ShoppingListDTO updateShoppingList(Long homeId, Long shoppingListId, String name) {
    Home home =
        homeRepository
            .findById(homeId)
            .orElseThrow(() -> new EntityNotFoundException("Home non trouvé"));
    ShoppingList list =
        shoppingListRepository
            .findByIdAndHome(shoppingListId, home)
            .orElseThrow(() -> new EntityNotFoundException("Liste de course non trouvée"));
    list.setName(name);
    list = shoppingListRepository.save(list);
    return ShoppingListMapper.convertToDto(list);
  }

  public void deleteShoppingList(Long homeId, Long id) {
    homeRepository
        .findById(homeId)
        .orElseThrow(() -> new EntityNotFoundException("Home non trouvé"));
    ShoppingList list =
        shoppingListRepository
            .findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Liste de course non trouvée"));
    shoppingListProductRepository.deleteAll(
        shoppingListProductRepository.findAllByShoppingList(list));
    shoppingListRepository.delete(list);
  }

  public ShoppingListProductDTO addProductToList(
      Long homeId, Long shoppingListId, Long productId, BigDecimal quantity, boolean checked) {
    homeRepository
        .findById(homeId)
        .orElseThrow(() -> new EntityNotFoundException("Home non trouvé"));
    ShoppingList list =
        shoppingListRepository
            .findById(shoppingListId)
            .orElseThrow(() -> new EntityNotFoundException("Liste non trouvée"));
    Product product =
        productRepository
            .findById(productId)
            .orElseThrow(() -> new EntityNotFoundException("Produit non trouvé"));

    ShoppingListProduct existingListProduct =
        shoppingListProductRepository.findByShoppingListAndProduct(list, product);

    if (existingListProduct != null) {
      existingListProduct.setQuantity(quantity);
      existingListProduct.setChecked(checked);
      shoppingListProductRepository.save(existingListProduct);
      return ShoppingListMapper.convertShoppingListProductToDto(existingListProduct);
    }

    ShoppingListProduct slp = new ShoppingListProduct();
    slp.setShoppingList(list);
    slp.setProduct(product);
    slp.setQuantity(quantity);
    slp.setChecked(checked);
    slp = shoppingListProductRepository.save(slp);
    return ShoppingListMapper.convertShoppingListProductToDto(slp);
  }

  @Transactional
  public void removeProductFromList(Long homeId, Long shoppingListId, List<Long> productIds) {
    homeRepository
        .findById(homeId)
        .orElseThrow(() -> new EntityNotFoundException("Home non trouvé"));
    shoppingListRepository
        .findById(shoppingListId)
        .orElseThrow(() -> new EntityNotFoundException("Liste non trouvée"));
    shoppingListProductRepository.deleteAllByProductIdIn(productIds);
  }
}
