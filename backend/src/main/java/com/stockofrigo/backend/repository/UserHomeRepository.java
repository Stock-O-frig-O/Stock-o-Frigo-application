package com.stockofrigo.backend.repository;

import com.stockofrigo.backend.model.Home;
import com.stockofrigo.backend.model.User;
import com.stockofrigo.backend.model.UserHome;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserHomeRepository extends JpaRepository<UserHome, Long> {
  UserHome findByUserAndHome(User user, Home home);

  List<UserHome> findAllByHome(Home home);
}
