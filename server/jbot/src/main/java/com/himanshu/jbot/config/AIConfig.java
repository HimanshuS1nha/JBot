package com.himanshu.jbot.config;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.google.genai.GoogleGenAiChatModel;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AIConfig {
    @Bean
    ChatClient chatClient(GoogleGenAiChatModel model) {
        return ChatClient.create(model);
    }
}
