package com.stockofrigo.backend.mapper;

import com.stockofrigo.backend.dto.HomeDTO;
import com.stockofrigo.backend.model.Home;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(
    componentModel = "spring",
    uses = {StockProductMapper.class, UserHomeMapper.class})
public interface HomeMapper {
  HomeMapper INSTANCE = Mappers.getMapper(HomeMapper.class);

  default HomeDTO convertToHomeDto(Home home) {
    if (home == null) return null;
    HomeDTO dto = new HomeDTO();
    dto.setId(home.getId());
    dto.setName(home.getName());
    return dto;
  }

  Home convertToHome(HomeDTO homeDTO);
}
