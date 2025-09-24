package com.stockofrigo.backend.controller;

import com.stockofrigo.backend.dto.UserSimpleDTO;
import com.stockofrigo.backend.model.User;
import com.stockofrigo.backend.repository.UserRepository;
import com.stockofrigo.backend.service.UserService;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/users")
public class UserController {

  private final UserRepository userRepository;
  private final UserService userService;

  public UserController(UserRepository userRepository, UserService userService) {
    this.userRepository = userRepository;
    this.userService = userService;
  }

  @GetMapping
  public ResponseEntity<List<User>> getUsers() {
    List<User> users = userRepository.findAll();
    if (users.isEmpty()) {
      return ResponseEntity.noContent().build();
    }
    return ResponseEntity.ok(users);
  }

  @PostMapping
  public ResponseEntity<User> register(@RequestBody User userRegistrationDTO) {
    User registeredUser = new User();

    registeredUser.setEmail(userRegistrationDTO.getEmail());
    registeredUser.setPassword(userRegistrationDTO.getPassword());

    User createdUser = userRepository.save(registeredUser);
    return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
  }

  @GetMapping("/me")
  public ResponseEntity<UserSimpleDTO> me() {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    if (auth == null || auth.getName() == null) {
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Utilisateur non authentifié");
    }
    User user = userService.getByEmailOrThrow(auth.getName());
    UserSimpleDTO dto = new UserSimpleDTO();
    dto.setId(user.getId());
    dto.setFirstName(user.getFirstName());
    dto.setLastName(user.getLastName());
    dto.setEmail(user.getEmail());
    return ResponseEntity.ok(dto);
  }
}
