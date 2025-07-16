package com.stockofrigo.backend.repository;

import com.stockofrigo.backend.model.Home;
import com.stockofrigo.backend.model.User;
import com.stockofrigo.backend.model.UserHome;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserHomeRepository extends JpaRepository<UserHome, Long> {
  UserHome findByUser(User user);

  UserHome findByUserAndHome(User user, Home home);
}
