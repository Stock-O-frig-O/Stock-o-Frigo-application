package com.stockofrigo.backend.controller;

import com.stockofrigo.backend.dto.UserRegistrationDTO;
import com.stockofrigo.backend.model.User;
import com.stockofrigo.backend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

  private final UserService userService;

  public AuthController(UserService userService) {
    this.userService = userService;
  }

  @PostMapping("/register")
  public ResponseEntity<User> register(@RequestBody UserRegistrationDTO userRegistrationDTO) {
    User savedUser =
        userService.registerUser(
            userRegistrationDTO.getFirstname(),
            userRegistrationDTO.getLastname(),
            userRegistrationDTO.getEmail(),
            userRegistrationDTO.getPassword());
    return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
  }
}
