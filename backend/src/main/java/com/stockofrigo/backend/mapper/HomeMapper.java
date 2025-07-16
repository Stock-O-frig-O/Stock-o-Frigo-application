package com.stockofrigo.backend.mapper;

import com.stockofrigo.backend.dto.HomeDTO;
import com.stockofrigo.backend.dto.UserSimpleDTO;
import com.stockofrigo.backend.model.Home;
import com.stockofrigo.backend.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(
    componentModel = "spring",
    uses = {StockProductMapper.class})
public interface HomeMapper {
  HomeMapper INSTANCE = Mappers.getMapper(HomeMapper.class);

  default HomeDTO convertToHomeDto(Home home) {
    if (home == null) return null;
    HomeDTO dto = new HomeDTO();
    dto.setId(home.getId());
    dto.setName(home.getName());
    if (home.getUserHomes() != null) {
      dto.setUsers(
          home.getUserHomes().stream()
              .map(
                  uh -> {
                    User user = uh.getUser();
                    UserSimpleDTO userDto = new UserSimpleDTO();
                    userDto.setId(user.getId());
                    userDto.setFirstName(user.getFirstName());
                    userDto.setLastName(user.getLastName());
                    userDto.setEmail(user.getEmail());
                    return userDto;
                  })
              .toList());
    }
    if (home.getStockProducts() != null) {
      dto.setStockedProducts(
          home.getStockProducts().stream()
              .map(StockProductMapper::convertToStockProductDto)
              .toList());
    }

    return dto;
  }

  Home convertToHome(HomeDTO homeDTO);
}
