package com.himanshu.jbot.exception;

import org.springframework.http.HttpStatus;

import lombok.Getter;

@Getter
public class JBotException extends Exception {
    private HttpStatus code;

    public JBotException(String message, HttpStatus code) {
        super(message);
        this.code = code;
    }
}
