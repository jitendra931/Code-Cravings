package com.codecravings.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.codecravings.Config.JwtProvider;
import com.codecravings.Repository.CartRepository;
import com.codecravings.Repository.UserRepository;
import com.codecravings.Services.CustomerUserDetailsService;
import com.codecravings.model.Cart;
import com.codecravings.model.USER_ROLE;
import com.codecravings.model.User;
import com.codecravings.request.LoginRequest;
import com.codecravings.response.AuthResponse;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtProvider jwtProvider;

    @Autowired
    private CustomerUserDetailsService customerUserDetailsService;

    @Autowired
    private CartRepository cartRepository;

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@RequestBody User user) {

        if (userRepository.findByEmail(user.getEmail()) != null) {
            throw new BadCredentialsException("Email already exists!");
        }

        USER_ROLE role = user.getRole() != null ? user.getRole() : USER_ROLE.ROLE_CUSTOMER;

        User createdUser = new User();
        createdUser.setEmail(user.getEmail());
        createdUser.setFullname(user.getFullname());
        createdUser.setRole(role);
        createdUser.setPassword(passwordEncoder.encode(user.getPassword()));

        User savedUser = userRepository.save(createdUser);

        Cart cart = new Cart();
        cart.setCustomer(savedUser);
        cartRepository.save(cart);

        // Authorities
        List<GrantedAuthority> authorities = List.of(
                new SimpleGrantedAuthority(savedUser.getRole().name()));

        // Authentication
        Authentication authentication = new UsernamePasswordAuthenticationToken(
                savedUser.getEmail(),
                null,
                authorities);

        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Generate JWT
        String jwt = jwtProvider.generateToken(authentication);

        // Response
        AuthResponse response = new AuthResponse();
        response.setJwt(jwt);
        response.setMessage("Register Successfully");
        response.setRole(savedUser.getRole());

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/signin")
    public ResponseEntity<AuthResponse> signin(@RequestBody LoginRequest req) {

        Authentication authentication = authenticate(
                req.getEmail(),
                req.getPassword());

        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Generate JWT
        String jwt = jwtProvider.generateToken(authentication);

        // Extract role
        String role = authentication.getAuthorities()
                .stream()
                .findFirst()
                .map(GrantedAuthority::getAuthority)
                .orElse("ROLE_CUSTOMER");

        // Response
        AuthResponse response = new AuthResponse();
        response.setJwt(jwt);
        response.setMessage("Login Successfully");
        response.setRole(USER_ROLE.valueOf(role));

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    private Authentication authenticate(String username, String password) {

        UserDetails userDetails = customerUserDetailsService.loadUserByUsername(username);

        if (userDetails == null) {
            throw new BadCredentialsException("Invalid username!");
        }

        if (!passwordEncoder.matches(password, userDetails.getPassword())) {
            throw new BadCredentialsException("Invalid Password!");
        }

        return new UsernamePasswordAuthenticationToken(
                userDetails,
                null,
                userDetails.getAuthorities());
    }
}