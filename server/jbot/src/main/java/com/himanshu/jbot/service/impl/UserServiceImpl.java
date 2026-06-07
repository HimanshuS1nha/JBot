package com.himanshu.jbot.service.impl;

import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.himanshu.jbot.dto.LoginRequest;
import com.himanshu.jbot.dto.RegisterRequest;
import com.himanshu.jbot.dto.UserDTO;
import com.himanshu.jbot.entity.User;
import com.himanshu.jbot.exception.JBotException;
import com.himanshu.jbot.repository.UserRepository;
import com.himanshu.jbot.service.UserService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    @Override
    public void createUser(RegisterRequest userData) throws JBotException {
        if (userRepository.existsByEmail(userData.getEmail())) {
            throw new JBotException("Email already exists", HttpStatus.CONFLICT);
        }

        if (!userData.getPassword().equals(userData.getConfirmPassword())) {
            throw new JBotException("Passwords do not match", HttpStatus.CONFLICT);
        }

        User user = new User();
        user.setEmail(userData.getEmail());
        user.setName(userData.getName());
        user.setPassword(passwordEncoder.encode(userData.getPassword()));

        userRepository.save(user);
    }

    @Override
    public UserDTO loginUser(LoginRequest userData) throws JBotException {
        try {
            authenticationManager
                    .authenticate(new UsernamePasswordAuthenticationToken(userData.getEmail(), userData.getPassword()));

            User user = userRepository.findByEmail(userData.getEmail())
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));

            return UserDTO.toDTO(user);
        } catch (Exception e) {
            throw new JBotException("Invalid credentials", HttpStatus.UNAUTHORIZED);
        }
    }

    @Override
    public UserDTO findByEmail(String email) throws JBotException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new JBotException("User not found", HttpStatus.NOT_FOUND));

        return UserDTO.toDTO(user);
    }

}
