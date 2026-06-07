package com.himanshu.jbot.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.himanshu.jbot.dto.MessageDTO;
import com.himanshu.jbot.entity.Conversation;
import com.himanshu.jbot.entity.User;
import com.himanshu.jbot.security.MyUserDetails;
import com.himanshu.jbot.enums.MessageRole;
import com.himanshu.jbot.service.ChatService;
import com.himanshu.jbot.service.ConversationService;
import com.himanshu.jbot.service.MessageService;
import com.himanshu.jbot.service.TokenService;
import com.himanshu.jbot.config.SecurityConfig;;

@WebMvcTest(AIController.class)
@Import(SecurityConfig.class)
public class AIControllerTests {
    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @MockitoBean
    private ChatService chatService;

    @MockitoBean
    private MessageService messageService;

    @MockitoBean
    private ConversationService conversationService;

    @MockitoBean
    private UserDetailsService userDetailsService;

    @MockitoBean
    private TokenService tokenService;

    @Test
    void generateResponse_valid() throws Exception {
        String content = "Test Content";

        User user = new User();
        user.setId(UUID.randomUUID());

        MyUserDetails myUserDetails = new MyUserDetails(user);

        Conversation conversation = new Conversation();
        conversation.setId(UUID.randomUUID());
        conversation.setUser(user);
        conversation.setIsTitleModified(true);

        MessageDTO messageDTO = new MessageDTO();
        messageDTO.setContent(content);
        messageDTO.setId("1234");
        messageDTO.setRole(MessageRole.User);

        when(conversationService.findByIdAndUserId(any(UUID.class), any(UUID.class))).thenReturn(conversation);
        doNothing().when(messageService).create(any(Conversation.class), anyString(), any(MessageRole.class));
        when(chatService.generateResponse(any())).thenReturn(content);

        mockMvc
                .perform(post("/ai/" + conversation.getId().toString() + "/chat")
                        .with(user(myUserDetails))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(List.of(messageDTO))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value(content));

        verify(messageService, times(2)).create(any(Conversation.class), anyString(), any(MessageRole.class));
    }
}
