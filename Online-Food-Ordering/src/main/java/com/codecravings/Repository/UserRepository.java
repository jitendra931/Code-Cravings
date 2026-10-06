package com.codecravings.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.codecravings.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    public User findByEmail(String username);
}
