package com.himanshu.jbot.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.himanshu.jbot.config.SecurityConfig;
import com.himanshu.jbot.dto.LoginRequest;
import com.himanshu.jbot.dto.RegisterRequest;
import com.himanshu.jbot.dto.UserDTO;
import com.himanshu.jbot.entity.User;
import com.himanshu.jbot.exception.JBotException;
import com.himanshu.jbot.security.MyUserDetails;
import com.himanshu.jbot.service.TokenService;
import com.himanshu.jbot.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.UUID;

@WebMvcTest(AuthController.class)
// @AutoConfigureMockMvc(addFilters = false)
@Import(SecurityConfig.class)
public class AuthControllerTests {
        @Autowired
        private MockMvc mockMvc;

        private final ObjectMapper objectMapper = new ObjectMapper();

        @MockitoBean
        private UserService userService;

        @MockitoBean
        private TokenService tokenService;

        @MockitoBean
        private UserDetailsService userDetailsService;

        @Test
        void loginUser_valid() throws Exception {
                LoginRequest loginRequest = new LoginRequest();
                loginRequest.setEmail("test@example.com");
                loginRequest.setPassword("password123");

                UserDTO userDTO = new UserDTO();
                userDTO.setId("1");
                userDTO.setName("Test User");
                userDTO.setEmail("test@example.com");

                when(userService.loginUser(any(LoginRequest.class))).thenReturn(userDTO);
                when(tokenService.generateToken("test@example.com")).thenReturn("mock-jwt-token");

                mockMvc
                                .perform(post("/auth/login")
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .content(objectMapper.writeValueAsString(loginRequest)))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.token").value("mock-jwt-token"))
                                .andExpect(jsonPath("$.user.email").value("test@example.com"))
                                .andExpect(jsonPath("$.user.name").value("Test User"));
        }

        @Test
        void loginUser_invalid_notFound() throws Exception {
                String exceptionMessage = "User not found";

                LoginRequest loginRequest = new LoginRequest();
                loginRequest.setEmail("test@example.com");
                loginRequest.setPassword("password123");

                when(userService.loginUser(any(LoginRequest.class)))
                                .thenThrow(new JBotException(exceptionMessage, HttpStatus.NOT_FOUND));

                mockMvc
                                .perform(post("/auth/login")
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .content(objectMapper.writeValueAsString(loginRequest)))
                                .andExpect(status().isNotFound())
                                .andExpect(jsonPath("$.message").value(exceptionMessage));
        }

        @Test
        void loginUser_invalid_validation() throws Exception {
                String exceptionMessage = "Email must be valid";

                LoginRequest loginRequest = new LoginRequest();
                loginRequest.setEmail("test");
                loginRequest.setPassword("password123");

                mockMvc
                                .perform(post("/auth/login")
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .content(objectMapper.writeValueAsString(loginRequest)))
                                .andExpect(status().isBadRequest())
                                .andExpect(jsonPath("$.message").value(exceptionMessage));
        }

        @Test
        void registerUser_valid() throws Exception {
                RegisterRequest registerRequest = new RegisterRequest();
                registerRequest.setName("Test User");
                registerRequest.setEmail("test@example.com");
                registerRequest.setPassword("password123");
                registerRequest.setConfirmPassword("password123");

                doNothing().when(userService).createUser(any(RegisterRequest.class));

                mockMvc
                                .perform(post("/auth/register")
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .content(objectMapper.writeValueAsString(registerRequest)))
                                .andExpect(status().isCreated())
                                .andExpect(jsonPath("$.message").value("Account created successfully"));

                verify(userService).createUser(registerRequest);
        }

        @Test
        void registerUser_invalid_emailAlreadyExists() throws Exception {
                String exceptionMessage = "Email already exists";

                RegisterRequest registerRequest = new RegisterRequest();
                registerRequest.setName("Test User");
                registerRequest.setEmail("test@example.com");
                registerRequest.setPassword("password123");
                registerRequest.setConfirmPassword("password123");

                doThrow(new JBotException(exceptionMessage, HttpStatus.CONFLICT)).when(userService)
                                .createUser(any(RegisterRequest.class));

                mockMvc
                                .perform(post("/auth/register")
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .content(objectMapper.writeValueAsString(registerRequest)))
                                .andExpect(status().isConflict())
                                .andExpect(jsonPath("$.message").value(exceptionMessage));

                verify(userService).createUser(registerRequest);
        }

        @Test
        void registerUser_invalid_passwordsNotMatching() throws Exception {
                String exceptionMessage = "Passwords do not match";

                RegisterRequest registerRequest = new RegisterRequest();
                registerRequest.setName("Test User");
                registerRequest.setEmail("test@example.com");
                registerRequest.setPassword("password12");
                registerRequest.setConfirmPassword("password123");

                doThrow(new JBotException(exceptionMessage, HttpStatus.CONFLICT)).when(userService)
                                .createUser(any(RegisterRequest.class));

                mockMvc
                                .perform(post("/auth/register")
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .content(objectMapper.writeValueAsString(registerRequest)))
                                .andExpect(status().isConflict())
                                .andExpect(jsonPath("$.message").value(exceptionMessage));

                verify(userService).createUser(registerRequest);
        }

        @Test
        void registerUser_invalid_validation() throws Exception {
                String exceptionMessage = "Name is required";

                RegisterRequest registerRequest = new RegisterRequest();
                registerRequest.setEmail("test@example.com");
                registerRequest.setPassword("password123");
                registerRequest.setConfirmPassword("password123");

                mockMvc
                                .perform(post("/auth/register")
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .content(objectMapper.writeValueAsString(registerRequest)))
                                .andExpect(status().isBadRequest())
                                .andExpect(jsonPath("$.message").value(exceptionMessage));
        }

        @Test
        void getLoggedInUser_valid() throws Exception {
                User user = new User();
                user.setId(UUID.randomUUID());
                user.setEmail("test@test.com");
                user.setName("Test User");

                when(userService.findByEmail(anyString())).thenReturn(UserDTO.toDTO(user));

                mockMvc
                                .perform(get("/auth/me")
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .with(user(new MyUserDetails(user))))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$").value(UserDTO.toDTO(user)));
        }

        @Test
        void getLoggedInUser_invalid_notFound() throws Exception {
                String exceptionMessage = "User not found";

                User user = new User();
                user.setId(UUID.randomUUID());
                user.setEmail("test@test.com");
                user.setName("Test User");

                when(userService.findByEmail(anyString()))
                                .thenThrow(new JBotException(exceptionMessage, HttpStatus.NOT_FOUND));

                mockMvc
                                .perform(get("/auth/me")
                                                .with(user(new MyUserDetails(user))))
                                .andExpect(status().isNotFound())
                                .andExpect(jsonPath("$.message").value(exceptionMessage));
        }
}
