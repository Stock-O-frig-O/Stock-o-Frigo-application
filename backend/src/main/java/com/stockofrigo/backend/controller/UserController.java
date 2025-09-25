package com.stockofrigo.backend.controller;

import com.stockofrigo.backend.model.User;
import com.stockofrigo.backend.repository.UserRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UserController {

  private final UserRepository userRepository;

  public UserController(UserRepository userRepository) {
    this.userRepository = userRepository;
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
}
