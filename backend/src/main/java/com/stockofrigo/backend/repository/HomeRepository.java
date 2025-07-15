package com.stockofrigo.backend.repository;

import com.stockofrigo.backend.model.Home;
import com.stockofrigo.backend.model.User;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface HomeRepository extends JpaRepository<Home, Long> {

  @Query("SELECT uh.home FROM UserHome uh WHERE uh.user = :user")
  List<Home> findHomesByUser(@Param("user") User user);
}
