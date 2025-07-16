package com.stockofrigo.backend.mapper;

import com.stockofrigo.backend.dto.HomeDTO;
import com.stockofrigo.backend.dto.StockProductDTO;
import com.stockofrigo.backend.dto.UserSimpleDTO;
import com.stockofrigo.backend.model.Home;
import com.stockofrigo.backend.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
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
              .map(
                  sp -> {
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
                  })
              .toList());
    }
    return dto;
  }

  Home convertToHome(HomeDTO homeDTO);
}
