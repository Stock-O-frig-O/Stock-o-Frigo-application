package com.stockofrigo.backend.controller;

import com.stockofrigo.backend.dto.UserLoginDTO;
import com.stockofrigo.backend.dto.UserRegistrationDTO;
import com.stockofrigo.backend.dto.UserSimpleDTO;
import com.stockofrigo.backend.model.User;
import com.stockofrigo.backend.security.AuthenticationService;
import com.stockofrigo.backend.security.JwtService;
import com.stockofrigo.backend.service.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/auth")
public class AuthController {

  private final UserService userService;
  private final AuthenticationService authenticationService;
  private final com.stockofrigo.backend.security.CustomUserDetailsService userDetailsService;
  private final JwtService jwtService;

  @org.springframework.beans.factory.annotation.Value("${security.cookie.secure:true}")
  private boolean cookieSecure;

  public AuthController(UserService userService, AuthenticationService authenticationService, com.stockofrigo.backend.security.CustomUserDetailsService userDetailsService, JwtService jwtService) {
    this.userService = userService;
    this.authenticationService = authenticationService;
    this.userDetailsService = userDetailsService;
    this.jwtService = jwtService;
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
  public ResponseEntity<String> authenticate(@RequestBody UserLoginDTO UserLoginDTO, HttpServletResponse response) {
    String token =
        authenticationService.authenticate(UserLoginDTO.getEmail(), UserLoginDTO.getPassword());

    // Also issue a refresh token as HttpOnly cookie to introduce refresh mechanism without breaking response body format
    UserDetails userDetails = userDetailsService.loadUserByUsername(UserLoginDTO.getEmail());
    String refreshToken = jwtService.generateRefreshToken(userDetails);
    Cookie cookie = new Cookie("refreshToken", refreshToken);
    cookie.setHttpOnly(true);
    cookie.setSecure(cookieSecure);
    cookie.setPath("/auth");
    cookie.setMaxAge((int) java.util.concurrent.TimeUnit.DAYS.toSeconds(30));
    response.addCookie(cookie);

    return ResponseEntity.ok(token);
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

  @PostMapping("/refresh")
  public ResponseEntity<String> refresh(HttpServletRequest request, HttpServletResponse response) {
    // Try cookie first
    String refreshToken = null;
    if (request.getCookies() != null) {
      for (Cookie c : request.getCookies()) {
        if ("refreshToken".equals(c.getName())) {
          refreshToken = c.getValue();
          break;
        }
      }
    }
    if (refreshToken == null) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Refresh token manquant");
    }
    if (!jwtService.validateJwtToken(refreshToken) || !jwtService.isRefreshToken(refreshToken)) {
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Refresh token invalide");
    }
    String email = jwtService.extractClaims(refreshToken).getSubject();
    UserDetails userDetails = userDetailsService.loadUserByUsername(email);
    String newAccess = jwtService.generateAccessToken(userDetails);

    // Rotate refresh token
    String newRefresh = jwtService.generateRefreshToken(userDetails);
    Cookie cookie = new Cookie("refreshToken", newRefresh);
    cookie.setHttpOnly(true);
    cookie.setSecure(cookieSecure);
    cookie.setPath("/auth");
    cookie.setMaxAge((int) java.util.concurrent.TimeUnit.DAYS.toSeconds(30));
    response.addCookie(cookie);

    return ResponseEntity.ok(newAccess);
  }
}
