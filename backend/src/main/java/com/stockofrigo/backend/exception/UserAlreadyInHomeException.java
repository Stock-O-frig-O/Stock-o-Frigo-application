package com.stockofrigo.backend.exception;

public class UserAlreadyInHomeException extends RuntimeException {
  public UserAlreadyInHomeException(String message) {
    super(message);
  }
}
