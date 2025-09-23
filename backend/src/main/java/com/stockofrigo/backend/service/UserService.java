package com.stockofrigo.backend.service;

import com.stockofrigo.backend.model.User;
import com.stockofrigo.backend.repository.UserRepository;
import java.time.LocalDateTime;
import java.util.Objects;
import java.util.regex.Pattern;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UserService {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;

  public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
  }

  private static final Pattern SIMPLE_EMAIL_REGEX =
      Pattern.compile("^[^@\n\r]+@[^@\n\r]+\\.[^@\n\r]+$");

  private String normalize(String s) {
    return s == null ? null : s.trim();
  }

  private void validateEmailOrThrow(String emailRaw) {
    String email = normalize(emailRaw);
    if (email == null || email.isBlank()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "L'email ne peut pas être vide");
    }
    if (!SIMPLE_EMAIL_REGEX.matcher(email).matches()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Format d'email invalide");
    }
  }

  private void validateNameOrThrow(String valueRaw, String fieldLabel) {
    String value = normalize(valueRaw);
    if (value == null || value.isBlank()) {
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST, fieldLabel + " ne peut pas être vide");
    }
  }

  private void validateNewPasswordOrThrow(String newPasswordRaw) {
    String newPassword = normalize(newPasswordRaw);
    if (newPassword == null || newPassword.isBlank()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Le nouveau mot de passe ne peut pas être vide");
    }
    if (newPassword.length() < 8) {
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST, "Le nouveau mot de passe doit contenir au moins 8 caractères");
    }
    // If you later add more registration constraints (uppercase/digit/special), enforce them here too.
  }

  /**
   * Directly sets a new password for the user without verifying the current password.
   * Restricted to admin users only.
   */
  public void setPasswordWithoutCurrent(User user, String newPassword) {
    // Only allow admins to change password without current password verification
    if (!Boolean.TRUE.equals(user.getIs_superuser())) {
      throw new ResponseStatusException(
          HttpStatus.FORBIDDEN, "Seuls les administrateurs peuvent changer le mot de passe sans vérification.");
    }
    validateNewPasswordOrThrow(newPassword);
    user.setPassword(passwordEncoder.encode(normalize(newPassword)));
    user.setModifiedAt(LocalDateTime.now());
    userRepository.save(user);
  }

  public User registerUser(String firstname, String lastname, String email, String password) {
    if (userRepository.existsByEmail(email)) {
      throw new RuntimeException("Cet email est déjà utilisé");
    }
    User user = new User();
    user.setFirstName(firstname);
    user.setLastName(lastname);
    user.setEmail(email);
    user.setPassword(passwordEncoder.encode(password)); // encodage du mot de passe avec BCrypt
    user.setCreatedAt(LocalDateTime.now());
    user.setModifiedAt(LocalDateTime.now());
    user.setLastLoginAt(LocalDateTime.now());
    user.setActive(true);
    user.setIs_superuser(false);

    return userRepository.save(user);
  }

  public User getByEmailOrThrow(String email) {
    return userRepository
        .findByEmail(email)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Utilisateur introuvable"));
  }

  public User updateProfile(User user, String newFirstNameRaw, String newLastNameRaw, String newEmailRaw) {
    String newEmail = normalize(newEmailRaw);
    String newFirstName = normalize(newFirstNameRaw);
    String newLastName = normalize(newLastNameRaw);

    if (newEmail != null && !Objects.equals(newEmail, user.getEmail())) {
      validateEmailOrThrow(newEmail);
      if (userRepository.existsByEmail(newEmail)) {
        throw new ResponseStatusException(HttpStatus.CONFLICT, "Cet email est déjà utilisé");
      }
      user.setEmail(newEmail);
    }
    if (newFirstName != null && !newFirstName.isBlank()) {
      validateNameOrThrow(newFirstName, "Le prénom");
      user.setFirstName(newFirstName);
    }
    if (newLastName != null && !newLastName.isBlank()) {
      validateNameOrThrow(newLastName, "Le nom");
      user.setLastName(newLastName);
    }
    user.setModifiedAt(LocalDateTime.now());
    return userRepository.save(user);
  }

  public void changePassword(User user, String currentPassword, String newPassword) {
    if (currentPassword == null || currentPassword.isBlank()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Le mot de passe actuel est requis");
    }
    if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Le mot de passe actuel est incorrect");
    }
    validateNewPasswordOrThrow(newPassword);
    user.setPassword(passwordEncoder.encode(normalize(newPassword)));
    user.setModifiedAt(LocalDateTime.now());
    userRepository.save(user);
  }
}
