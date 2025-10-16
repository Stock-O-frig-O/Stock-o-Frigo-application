package com.stockofrigo.backend.security;

import java.util.List;
import java.util.Objects;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
  @Autowired private final JwtAuthenticationFilter jwtAuthenticationFilter;
  @Autowired private final CustomUserDetailsService customUserDetailsService;

  public SecurityConfig(
      JwtAuthenticationFilter jwtAuthenticationFilter,
      CustomUserDetailsService customUserDetailsService) {
    this.jwtAuthenticationFilter =
        Objects.requireNonNull(jwtAuthenticationFilter, "JwtAuthenticationFilter cannot be null");
    this.customUserDetailsService =
        Objects.requireNonNull(customUserDetailsService, "CustomUserDetailsService cannot be null");
  }

  @Value("${cors.allowed-origin}")
  private String allowedOrigin;

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  @Bean
  public AuthenticationManager authenticationManager(
      AuthenticationConfiguration authenticationConfiguration) throws Exception {
    return authenticationConfiguration.getAuthenticationManager();
  }

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http.csrf(AbstractHttpConfigurer::disable)
        .cors(
            cors ->
                cors.configurationSource(
                    request -> {
                      CorsConfiguration config = new CorsConfiguration();
                      config.setAllowedOrigins(List.of(allowedOrigin));
                      config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                      config.setAllowedHeaders(List.of("*"));
                      config.setAllowCredentials(true);
                      config.setExposedHeaders(List.of("Authorization"));
                      return config;
                    }))
        .authorizeHttpRequests(
            auth ->
                auth.requestMatchers(
                        "/auth/login",
                        "/auth/register",
                        "/auth/refresh",
                        "/docs/**",
                        "/v3/api-docs/**",
                        "/swagger-ui/**",
                        "/swagger-ui.html")
                    .permitAll()
                    .requestMatchers("/profile/**", "/api/profile/**", "/auth/me")
                    .authenticated()
                    .anyRequest()
                    .permitAll())
        .userDetailsService(customUserDetailsService)
        .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

    return http.build();
  }
}
