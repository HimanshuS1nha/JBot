package com.himanshu.jbot.service.impl;

import java.util.Date;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.himanshu.jbot.exception.JBotException;
import com.himanshu.jbot.security.JWTService;
import com.himanshu.jbot.service.TokenService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TokenServiceImpl implements TokenService {
    private final JWTService jwtService;

    @Override
    public String generateToken(String subject) {
        return jwtService.generateToken(subject,
                new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24 * 15)); // 15 days
    }

    @Override
    public String verifyToken(String token) throws JBotException {
        if (jwtService.extractExpiration(token).before(new Date())) {
            throw new JBotException("Token has expired", HttpStatus.UNAUTHORIZED);
        }

        return jwtService.extractSubject(token);
    }

}
