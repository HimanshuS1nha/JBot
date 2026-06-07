package com.himanshu.jbot.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.himanshu.jbot.dto.LoginRequest;
import com.himanshu.jbot.dto.LoginResponse;
import com.himanshu.jbot.dto.MessageResponse;
import com.himanshu.jbot.dto.RegisterRequest;
import com.himanshu.jbot.dto.UserDTO;
import com.himanshu.jbot.exception.JBotException;
import com.himanshu.jbot.service.TokenService;
import com.himanshu.jbot.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final UserService userService;
    private final TokenService tokenService;

    @PostMapping("/register")
    public ResponseEntity<MessageResponse> registerUser(@Valid @RequestBody RegisterRequest registerRequest)
            throws JBotException {
        userService.createUser(registerRequest);

        MessageResponse response = new MessageResponse("Account created successfully");
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> loginUser(@Valid @RequestBody LoginRequest loginRequest)
            throws JBotException {
        UserDTO user = userService.loginUser(loginRequest);

        LoginResponse response = new LoginResponse(user, tokenService.generateToken(loginRequest.getEmail()));

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/me")
    public ResponseEntity<UserDTO> getLoggedInUser(@AuthenticationPrincipal UserDetails userDetails)
            throws JBotException {
        UserDTO user = userService.findByEmail(userDetails.getUsername());

        return new ResponseEntity<>(user, HttpStatus.OK);
    }
}
