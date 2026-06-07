package com.himanshu.jbot.service;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.himanshu.jbot.dto.LoginRequest;
import com.himanshu.jbot.dto.RegisterRequest;
import com.himanshu.jbot.dto.UserDTO;
import com.himanshu.jbot.entity.User;
import com.himanshu.jbot.exception.JBotException;
import com.himanshu.jbot.repository.UserRepository;
import com.himanshu.jbot.service.impl.UserServiceImpl;

@ExtendWith(MockitoExtension.class)
public class UserServiceTests {
    @Mock
    private UserRepository userRepository;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserServiceImpl userService;

    @Test
    void findByEmail_valid() throws Exception {
        User user = new User();
        user.setId(UUID.randomUUID());
        user.setEmail("test@test.com");
        user.setName("Test User");

        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(user));

        assertEquals(UserDTO.toDTO(user), userService.findByEmail(user.getEmail()));
    }

    @Test
    void findByEmail_invalid_notFound() throws Exception {
        String exceptionMessage = "User not found";

        User user = new User();
        user.setId(UUID.randomUUID());
        user.setEmail("test@test.com");
        user.setName("Test User");

        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());

        JBotException exception = assertThrows(JBotException.class, () -> userService.findByEmail(user.getEmail()));

        assertEquals(exceptionMessage, exception.getMessage());
        assertEquals(HttpStatus.NOT_FOUND, exception.getCode());
    }

    @Test
    void loginUser_valid() throws Exception {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("test@test.com");
        loginRequest.setPassword("12345678");

        User user = new User();
        user.setId(UUID.randomUUID());
        user.setEmail("test@test.com");
        user.setName("Test User");

        // Does not matter what it returns
        when(authenticationManager.authenticate(any())).thenReturn(null);
        when(userRepository.findByEmail(loginRequest.getEmail())).thenReturn(Optional.of(user));

        assertEquals(UserDTO.toDTO(user), userService.loginUser(loginRequest));
    }

    @Test
    void loginUser_invalid_authIssue() throws Exception {
        String exceptionMessage = "Invalid credentials";

        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("test@test.com");
        loginRequest.setPassword("12345678");

        when(authenticationManager.authenticate(any())).thenThrow(new RuntimeException());

        JBotException exception = assertThrows(JBotException.class, () -> userService.loginUser(loginRequest));

        assertEquals(exceptionMessage, exception.getMessage());
        assertEquals(HttpStatus.UNAUTHORIZED, exception.getCode());
    }

    @Test
    void createUser_valid() throws Exception {
        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setEmail("test@test.com");
        registerRequest.setName("Test User");
        registerRequest.setPassword("12345678");
        registerRequest.setConfirmPassword("12345678");

        when(userRepository.existsByEmail(registerRequest.getEmail())).thenReturn(false);
        when(userRepository.save(any(User.class))).thenReturn(new User());
        when(passwordEncoder.encode(anyString())).thenReturn(new String());

        assertDoesNotThrow(() -> userService.createUser(registerRequest));
    }

    @Test
    void createUser_invalid_passwordsNotMatching() throws Exception {
        String exceptionMessage = "Passwords do not match";
        
        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setEmail("test@test.com");
        registerRequest.setName("Test User");
        registerRequest.setPassword("12345678");
        registerRequest.setConfirmPassword("12345679");

        when(userRepository.existsByEmail(registerRequest.getEmail())).thenReturn(false);

        JBotException exception = assertThrows(JBotException.class, () -> userService.createUser(registerRequest));

        assertEquals(exceptionMessage, exception.getMessage());
        assertEquals(HttpStatus.CONFLICT, exception.getCode());
    }

    @Test
    void createUser_invalid_emailAlreadyExists() throws Exception {
        String exceptionMessage = "Email already exists";

        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setEmail("test@test.com");
        registerRequest.setName("Test User");
        registerRequest.setPassword("12345678");
        registerRequest.setConfirmPassword("12345679");

        when(userRepository.existsByEmail(registerRequest.getEmail())).thenReturn(true);

        JBotException exception = assertThrows(JBotException.class, () -> userService.createUser(registerRequest));

        assertEquals(exceptionMessage, exception.getMessage());
        assertEquals(HttpStatus.CONFLICT, exception.getCode());
    }
}
