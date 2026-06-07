package com.himanshu.jbot.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.messages.AssistantMessage;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.stereotype.Service;

import com.himanshu.jbot.dto.MessageDTO;
import com.himanshu.jbot.service.ChatService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {
    private final ChatClient chatClient;

    @Override
    public String generateResponse(List<MessageDTO> messages) {
        List<Message> promptMessages = new ArrayList<>();

        for (MessageDTO message : messages) {
            switch (message.getRole()) {
                case User:
                    promptMessages.add(new UserMessage(message.getContent()));
                    break;
                case Assistant:
                    promptMessages.add(new AssistantMessage(message.getContent()));
                    break;
                default:
                    break;
            }
        }

        Prompt prompt = new Prompt(promptMessages);

        return chatClient.prompt(prompt).call().content();
    }

    @Override
    public String generateTitle(String input) {
        return chatClient
                .prompt()
                .system("Your task is to generate a 1 to 3 words title from the user's message")
                .user(input)
                .call()
                .content();
    }
}
