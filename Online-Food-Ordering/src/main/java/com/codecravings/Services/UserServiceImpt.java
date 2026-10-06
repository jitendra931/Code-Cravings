package com.codecravings.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.codecravings.Config.JwtProvider;
import com.codecravings.Repository.UserRepository;
import com.codecravings.model.User;

@Service
public class UserServiceImpt implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtProvider jwtProvider;

    @Override
    public User findUserByJwtToken(String jwt) throws Exception {
        String email = jwtProvider.getEmailFromjwtToken(jwt);

        User user = findUserByEmail(email);

        return user;
    }

    @Override
    public User findUserByEmail(String Email) throws Exception {

        User user = userRepository.findByEmail(Email);

        if (user == null) {
            throw new UsernameNotFoundException("User Not Found!");
        }
        return user;
    }

    @Override
    public User findUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

}
