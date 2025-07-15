package com.stockofrigo.backend.mapper;

import com.stockofrigo.backend.dto.ProductDTO;
import com.stockofrigo.backend.model.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface ProductMapper {

  ProductMapper INSTANCE = Mappers.getMapper(ProductMapper.class);

  @Mapping(target = "unitId", source = "unit.id")
  @Mapping(target = "categoryId", source = "category.id")
  ProductDTO convertToDto(Product product);

  @Mapping(target = "unit", ignore = true)
  @Mapping(target = "createdAt", ignore = true)
  @Mapping(target = "updatedAt", ignore = true)
  Product convertToProduct(ProductDTO productDTO);
}
