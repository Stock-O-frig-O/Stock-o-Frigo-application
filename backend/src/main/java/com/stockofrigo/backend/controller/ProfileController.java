package com.stockofrigo.backend.controller;

import com.stockofrigo.backend.dto.PasswordChangeDTO;
import com.stockofrigo.backend.dto.UserProfileDTO;
import com.stockofrigo.backend.dto.UserProfileUpdateDTO;
import com.stockofrigo.backend.mapper.UserProfileMapper;
import com.stockofrigo.backend.model.User;
import com.stockofrigo.backend.repository.UserRepository;
import com.stockofrigo.backend.security.JwtService;
import com.stockofrigo.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping({"/profile", "/api/profile"})
public class ProfileController {

  private final UserService userService;
  private final JwtService jwtService;

  @Autowired private UserProfileMapper mapper;

  @Autowired private UserRepository userRepository;

  public ProfileController(UserService userService, JwtService jwtService) {
    this.userService = userService;
    this.jwtService = jwtService;
  }

  private String getCurrentEmail() {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    if (auth == null || auth.getName() == null) {
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Utilisateur non authentifié");
    }
    return auth.getName();
  }

  private UserProfileDTO toDto(User user) {
    UserProfileDTO dto = new UserProfileDTO();
    dto.setId(user.getId());
    dto.setFirstName(user.getFirstName());
    dto.setLastName(user.getLastName());
    dto.setEmail(user.getEmail());
    return dto;
  }

  @GetMapping("/me")
  public ResponseEntity<UserProfileDTO> me() {
    String email = getCurrentEmail();
    User user = userService.getByEmailOrThrow(email);
    return ResponseEntity.ok(toDto(user));
  }

  // Alias for GET /profile or GET /api/profile without /me
  @GetMapping("")
  public ResponseEntity<UserProfileDTO> meAlias() {
    return me();
  }

  @PutMapping("/me")
  public ResponseEntity<UserProfileDTO> update(@RequestBody UserProfileUpdateDTO updateDTO) {
    User user = userService.getByEmailOrThrow(getCurrentEmail());

    mapper.updateEntityFromDto(updateDTO, user);
    userRepository.save(user);

    return ResponseEntity.ok(mapper.toDto(user));
  }

  // Alias for PUT /profile or PUT /api/profile without /me
  @PutMapping("")
  public ResponseEntity<UserProfileDTO> updateAlias(@RequestBody UserProfileUpdateDTO updateDTO) {
    return update(updateDTO);
  }

  @PutMapping("/password")
  public ResponseEntity<Void> changePassword(@RequestBody PasswordChangeDTO dto) {
    if (dto.getNewPassword() == null || !dto.getNewPassword().equals(dto.getConfirmNewPassword())) {
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST, "La confirmation du mot de passe ne correspond pas");
    }
    String email = getCurrentEmail();
    User user = userService.getByEmailOrThrow(email);
    userService.changePassword(user, dto.getCurrentPassword(), dto.getNewPassword());
    return ResponseEntity.noContent().build();
  }
}
