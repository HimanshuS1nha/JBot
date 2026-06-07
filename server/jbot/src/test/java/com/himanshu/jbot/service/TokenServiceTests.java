package com.himanshu.jbot.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

import java.util.Date;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;

import com.himanshu.jbot.exception.JBotException;
import com.himanshu.jbot.security.JWTService;
import com.himanshu.jbot.service.impl.TokenServiceImpl;

@ExtendWith(MockitoExtension.class)
public class TokenServiceTests {
    @Mock
    private JWTService jwtService;

    @InjectMocks
    private TokenServiceImpl tokenService;

    @Test
    void generateToken_valid() throws Exception {
        String subject = "test@test.com";

        String token = "mock-test-token";

        when(jwtService.generateToken(anyString(), any(Date.class))).thenReturn(token);

        assertEquals(token, tokenService.generateToken(subject));
    }

    @Test
    void verifyToken_valid() throws Exception {
        String subject = "test@test.com";
        Date expiry = new Date(System.currentTimeMillis() + 1000 * 60);

        String token = "mock-test-token";

        when(jwtService.extractExpiration(anyString())).thenReturn(expiry);
        when(jwtService.extractSubject(anyString())).thenReturn(subject);

        assertEquals(subject, tokenService.verifyToken(token));
    }

    @Test
    void verifyToken_invalid_expiredToken() throws Exception {
        Date expiry = new Date(System.currentTimeMillis() - 1000 * 60);
        String exceptionMessage = "Token has expired";

        String token = "mock-test-token";

        when(jwtService.extractExpiration(anyString())).thenReturn(expiry);

        JBotException exception = assertThrows(JBotException.class, () -> tokenService.verifyToken(token));

        assertEquals(exceptionMessage, exception.getMessage());
        assertEquals(HttpStatus.UNAUTHORIZED, exception.getCode());
    }
}
