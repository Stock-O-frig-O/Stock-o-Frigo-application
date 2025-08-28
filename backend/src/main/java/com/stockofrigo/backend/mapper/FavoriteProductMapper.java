package com.stockofrigo.backend.mapper;

import com.stockofrigo.backend.dto.FavoriteProductDTO;
import com.stockofrigo.backend.model.FavoriteProduct;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface FavoriteProductMapper {

  FavoriteProductMapper INSTANCE = Mappers.getMapper(FavoriteProductMapper.class);

  static FavoriteProductDTO convertToFavoriteProductDto(FavoriteProduct favoriteProduct) {
    if (favoriteProduct == null) return null;
    FavoriteProductDTO dto = new FavoriteProductDTO();
    dto.setLimit(favoriteProduct.getLimit());
    dto.setId(favoriteProduct.getId());
    dto.setProductId(favoriteProduct.getProduct().getId());
    dto.setName(favoriteProduct.getProduct().getName());
    dto.setBrand(favoriteProduct.getProduct().getBrand());
    dto.setUnit(favoriteProduct.getProduct().getUnit().getUnit());
    dto.setCategory(favoriteProduct.getProduct().getCategory().getName());
    dto.setHomeId(favoriteProduct.getHome().getId());
    return dto;
  }
}
