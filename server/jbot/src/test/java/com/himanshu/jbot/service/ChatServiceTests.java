package com.himanshu.jbot.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.ChatClient.CallResponseSpec;
import org.springframework.ai.chat.client.ChatClient.ChatClientRequestSpec;
import org.springframework.ai.chat.prompt.Prompt;

import com.himanshu.jbot.dto.MessageDTO;
import com.himanshu.jbot.enums.MessageRole;
import com.himanshu.jbot.service.impl.ChatServiceImpl;

@ExtendWith(MockitoExtension.class)
public class ChatServiceTests {
    @Mock
    private ChatClient chatClient;

    @Mock
    private ChatClientRequestSpec chatClientRequestSpec;

    @Mock
    private CallResponseSpec callResponseSpec;

    @InjectMocks
    private ChatServiceImpl chatService;

    @Test
    void generateTitle_valid() throws Exception {
        String content = "Test Content";
        String input = "Test Input";

        when(chatClient.prompt()).thenReturn(chatClientRequestSpec);
        when(chatClientRequestSpec.system(anyString())).thenReturn(chatClientRequestSpec);
        when(chatClientRequestSpec.user(anyString())).thenReturn(chatClientRequestSpec);
        when(chatClientRequestSpec.call()).thenReturn(callResponseSpec);
        when(callResponseSpec.content()).thenReturn(content);

        assertEquals(content, chatService.generateTitle(input));
    }

    @Test
    void generateResponse_valid() throws Exception {
        String content = "Test Content";

        MessageDTO messageDTO = new MessageDTO();
        messageDTO.setContent("Test Content");
        messageDTO.setRole(MessageRole.User);
        messageDTO.setId("1234");

        when(chatClient.prompt(any(Prompt.class))).thenReturn(chatClientRequestSpec);
        when(chatClientRequestSpec.call()).thenReturn(callResponseSpec);
        when(callResponseSpec.content()).thenReturn(content);

        assertEquals(content, chatService.generateResponse(List.of(messageDTO)));
    }
}
