package com.stockofrigo.backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Date;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
public class JwtService {
  @Value("${security.jwt.secret-key}")
  private String secretKey;

  @Value("${security.jwt.expiration-time}")
  private Long jwtExpiration;

  @Value("${security.jwt.refresh-expiration-time:2592000000}") // default 30 days
  private Long refreshExpiration;

  private Key signingKey;

  @PostConstruct
  @SuppressWarnings("PMD.UnusedPrivateMethod") // Used by @PostConstruct
  private void initSigningKey() {
    byte[] keyBytes;
    if (secretKey == null || secretKey.isBlank()) {
      throw new IllegalStateException(
          "JWT secret key is missing. Please set 'security.jwt.secret-key' (env var JWT_SECRET_KEY) in your configuration.");
    }
    try {
      // Prefer Base64-encoded secrets
      keyBytes = Decoders.BASE64.decode(secretKey);
    } catch (IllegalArgumentException ex) {
      // Fallback to raw bytes from the provided string
      keyBytes = secretKey.getBytes(StandardCharsets.UTF_8);
    }
    // Ensure at least 256-bit key material. If shorter, derive 256 bits via SHA-256.
    if (keyBytes.length < 32) {
      try {
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        keyBytes = digest.digest(keyBytes);
      } catch (NoSuchAlgorithmException e) {
        throw new IllegalStateException(
            "SHA-256 algorithm not available for JWT key derivation", e);
      }
    }
    signingKey = Keys.hmacShaKeyFor(keyBytes);
  }

  public String generateAccessToken(UserDetails userDetails) {
    long expMillis = jwtExpiration != null ? jwtExpiration : 3600_000L;
    return Jwts.builder()
        .setSubject(userDetails.getUsername())
        .claim(
            "roles",
            userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList()))
        .claim("tokenType", "access")
        .setIssuedAt(new Date())
        .setExpiration(new Date(System.currentTimeMillis() + expMillis))
        .signWith(signingKey, SignatureAlgorithm.HS256)
        .compact();
  }

  public String generateRefreshToken(UserDetails userDetails) {
    long expMillis = refreshExpiration != null ? refreshExpiration : 30L * 24 * 3600_000L;
    return Jwts.builder()
        .setSubject(userDetails.getUsername())
        .claim("tokenType", "refresh")
        .setIssuedAt(new Date())
        .setExpiration(new Date(System.currentTimeMillis() + expMillis))
        .signWith(signingKey, SignatureAlgorithm.HS256)
        .compact();
  }

  public Claims extractClaims(String token) {
    return Jwts.parserBuilder().setSigningKey(signingKey).build().parseClaimsJws(token).getBody();
  }

  public boolean validateJwtToken(String token) {
    try {
      Jwts.parserBuilder().setSigningKey(signingKey).build().parseClaimsJws(token);
      return true;
    } catch (JwtException | IllegalArgumentException e) {
      return false;
    }
  }

  public boolean isRefreshToken(String token) {
    try {
      Claims claims = extractClaims(token);
      return "refresh".equals(claims.get("tokenType", String.class));
    } catch (Exception e) {
      return false;
    }
  }

  public boolean isAccessToken(String token) {
    try {
      Claims claims = extractClaims(token);
      return "access".equals(claims.get("tokenType", String.class));
    } catch (Exception e) {
      return false;
    }
  }
}
