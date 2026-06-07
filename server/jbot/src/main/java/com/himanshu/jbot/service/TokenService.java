package com.himanshu.jbot.service;

import com.himanshu.jbot.exception.JBotException;

public interface TokenService {
    public String generateToken(String subject);

    public String verifyToken(String token) throws JBotException;
}
