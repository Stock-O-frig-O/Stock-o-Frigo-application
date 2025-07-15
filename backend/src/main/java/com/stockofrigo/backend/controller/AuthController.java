package com.stockofrigo.backend.controller;

import com.stockofrigo.backend.dto.UserLoginDTO;
import com.stockofrigo.backend.dto.UserRegistrationDTO;
import com.stockofrigo.backend.model.User;
import com.stockofrigo.backend.security.AuthenticationService;
import com.stockofrigo.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

  @Autowired private final UserService userService;
  @Autowired private final AuthenticationService authenticationService;

  public AuthController(UserService userService, AuthenticationService authenticationService) {
    this.userService = userService;
    this.authenticationService = authenticationService;
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

  @PostMapping("/login")
  public ResponseEntity<String> authenticate(@RequestBody UserLoginDTO UserLoginDTO) {
    String token =
        authenticationService.authenticate(UserLoginDTO.getEmail(), UserLoginDTO.getPassword());
    return ResponseEntity.ok(token);
  }
}
