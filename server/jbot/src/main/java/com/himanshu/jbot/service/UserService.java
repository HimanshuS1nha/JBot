package com.himanshu.jbot.service;

import com.himanshu.jbot.dto.LoginRequest;
import com.himanshu.jbot.dto.RegisterRequest;
import com.himanshu.jbot.dto.UserDTO;
import com.himanshu.jbot.exception.JBotException;

public interface UserService {
    public void createUser(RegisterRequest userData) throws JBotException;

    public UserDTO loginUser(LoginRequest userData) throws JBotException;

    public UserDTO findByEmail(String email) throws JBotException;
}
