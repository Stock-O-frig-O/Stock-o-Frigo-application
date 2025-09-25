package com.stockofrigo.backend.dto;

import com.fasterxml.jackson.annotation.JsonAlias;

public class UserProfileUpdateDTO {
  @JsonAlias({"first_name"})
  private String firstName;

  @JsonAlias({"last_name"})
  private String lastName;

  @JsonAlias({"mail", "emailAddress", "e-mail"})
  private String email;

  // Optional password change fields (when provided, backend will attempt to change password)
  @JsonAlias({"current_password", "oldPassword", "old_password", "passwordCurrent"})
  private String currentPassword;

  @JsonAlias({"new_password", "password", "passwordNew", "newPassword", "haslo", "hhaslo"})
  private String newPassword;

  @JsonAlias({
    "confirm_new_password",
    "confirmPassword",
    "passwordConfirm",
    "password_confirmation",
    "confirm",
    "confirmPasswordNew"
  })
  private String confirmNewPassword;

  public String getFirstName() {
    return firstName;
  }

  public void setFirstName(String firstName) {
    this.firstName = firstName;
  }

  public String getLastName() {
    return lastName;
  }

  public void setLastName(String lastName) {
    this.lastName = lastName;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getCurrentPassword() {
    return currentPassword;
  }

  public void setCurrentPassword(String currentPassword) {
    this.currentPassword = currentPassword;
  }

  public String getNewPassword() {
    return newPassword;
  }

  public void setNewPassword(String newPassword) {
    this.newPassword = newPassword;
  }

  public String getConfirmNewPassword() {
    return confirmNewPassword;
  }

  public void setConfirmNewPassword(String confirmNewPassword) {
    this.confirmNewPassword = confirmNewPassword;
  }
}
