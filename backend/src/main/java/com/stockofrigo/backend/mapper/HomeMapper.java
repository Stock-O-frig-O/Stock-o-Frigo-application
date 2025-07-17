package com.stockofrigo.backend.mapper;

import com.stockofrigo.backend.dto.HomeDTO;
import com.stockofrigo.backend.model.Home;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface HomeMapper {
  HomeMapper INSTANCE = Mappers.getMapper(HomeMapper.class);

  HomeDTO convertToHomeDto(Home home);

  Home convertToHome(HomeDTO homeDTO);
}
