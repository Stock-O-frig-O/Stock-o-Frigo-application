package com.stockofrigo.backend.mapper;

import com.stockofrigo.backend.dto.UserProfileDTO;
import com.stockofrigo.backend.dto.UserProfileUpdateDTO;
import com.stockofrigo.backend.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class UserProfileMapper {

  @Autowired private PasswordEncoder passwordEncoder;

  public void updateEntityFromDto(UserProfileUpdateDTO dto, User user) {
    if (dto.getFirstName() != null) user.setFirstName(dto.getFirstName());
    if (dto.getLastName() != null) user.setLastName(dto.getLastName());
    if (dto.getEmail() != null) user.setEmail(dto.getEmail());

    if (dto.getNewPassword() != null && dto.getConfirmNewPassword() != null) {
      if (!dto.getNewPassword().equals(dto.getConfirmNewPassword())) {
        throw new IllegalArgumentException("Password confirmation does not match");
      }
      user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
    }
  }

  public UserProfileDTO toDto(User user) {
    UserProfileDTO dto = new UserProfileDTO();
    dto.setFirstName(user.getFirstName());
    dto.setLastName(user.getLastName());
    dto.setEmail(user.getEmail());
    return dto;
  }
}
