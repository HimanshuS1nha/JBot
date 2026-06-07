package com.himanshu.jbot.exception;

import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.himanshu.jbot.dto.MessageResponse;

@RestControllerAdvice
public class ExceptionHandlerAdvice {
    @ExceptionHandler(JBotException.class)
    public ResponseEntity<MessageResponse> jBotExceptionHandler(JBotException exception) {
        MessageResponse response = new MessageResponse(exception.getMessage());

        return new ResponseEntity<>(response, exception.getCode());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<MessageResponse> methodArgumentNotValidExceptionHandler(
            MethodArgumentNotValidException exception) {
        String message = exception.getAllErrors().stream().map(error -> error.getDefaultMessage())
                .collect(Collectors.joining(", "));

        MessageResponse response = new MessageResponse(message);

        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<MessageResponse> exceptionHandler(Exception exception) {
        MessageResponse response = new MessageResponse("Some error occurred. Please try again later!");

        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
