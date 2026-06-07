package com.himanshu.jbot.logging;

import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class LoggingAspect {
    private static Logger LOGGER = LoggerFactory.getLogger(LoggingAspect.class);

    // Any service class function
    @AfterThrowing(pointcut = "execution(* com.himanshu.jbot.service.impl.*.*(..))")
    public void logServiceLevelException(Exception exception) {
        LOGGER.error(exception.getMessage(), exception);
    }
}
