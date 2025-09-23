package com.stockofrigo.backend.dto;

import com.fasterxml.jackson.annotation.JsonAlias;

public class PasswordChangeDTO {
  @JsonAlias({"current_password", "oldPassword", "old_password", "passwordCurrent"})
  private String currentPassword;

  @JsonAlias({"new_password", "password", "passwordNew"})
  private String newPassword;

  @JsonAlias({"confirm_new_password", "confirmPassword", "passwordConfirm", "password_confirmation"})
  private String confirmNewPassword;

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
