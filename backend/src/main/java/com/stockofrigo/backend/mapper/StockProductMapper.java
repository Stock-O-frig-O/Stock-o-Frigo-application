package com.stockofrigo.backend.mapper;

import com.stockofrigo.backend.dto.StockProductDTO;
import com.stockofrigo.backend.model.StockProduct;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface StockProductMapper {

  StockProductMapper INSTANCE = Mappers.getMapper(StockProductMapper.class);

  static StockProductDTO convertToStockProductDto(StockProduct sp) {
    if (sp == null) return null;
    StockProductDTO prodDto = new StockProductDTO();
    prodDto.setId(sp.getId());
    prodDto.setQuantity(sp.getQuantity());
    if (sp.getProduct() != null) {
      prodDto.setProductId(sp.getProduct().getId());
      prodDto.setName(sp.getProduct().getName());
      prodDto.setBrand(sp.getProduct().getBrand());
      prodDto.setUnit(sp.getProduct().getUnit().getUnit());
    }
    return prodDto;
  }
}
