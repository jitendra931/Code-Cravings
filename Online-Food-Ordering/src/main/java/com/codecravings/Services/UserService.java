package com.codecravings.Services;

import com.codecravings.model.User;

public interface UserService {

    public User findUserByJwtToken(String jwt) throws Exception;

    public User findUserByEmail(String Email) throws Exception;

    public User findUserById(Long id);
}
