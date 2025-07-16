package com.stockofrigo.backend.mapper;

import com.stockofrigo.backend.dto.UserSimpleDTO;
import com.stockofrigo.backend.model.User;
import com.stockofrigo.backend.model.UserHome;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface UserHomeMapper {

  UserHomeMapper INSTANCE = Mappers.getMapper(UserHomeMapper.class);

  static UserSimpleDTO convertToUserSimpleDto(UserHome userHome) {
    User user = userHome.getUser();
    UserSimpleDTO userDto = new UserSimpleDTO();
    userDto.setId(user.getId());
    userDto.setFirstName(user.getFirstName());
    userDto.setLastName(user.getLastName());
    userDto.setEmail(user.getEmail());
    return userDto;
  }
}
