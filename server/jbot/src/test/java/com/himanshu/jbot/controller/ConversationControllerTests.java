package com.himanshu.jbot.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.himanshu.jbot.config.SecurityConfig;
import com.himanshu.jbot.dto.ConversationDTO;
import com.himanshu.jbot.dto.EditConversationTitleRequest;
import com.himanshu.jbot.dto.MessageDTO;
import com.himanshu.jbot.entity.Conversation;
import com.himanshu.jbot.entity.User;
import com.himanshu.jbot.security.MyUserDetails;
import com.himanshu.jbot.service.ConversationService;
import com.himanshu.jbot.service.MessageService;
import com.himanshu.jbot.service.TokenService;

@WebMvcTest(ConversationController.class)
@Import(SecurityConfig.class)
public class ConversationControllerTests {
    @MockitoBean
    private MessageService messageService;

    @MockitoBean
    private ConversationService conversationService;

    @MockitoBean
    private UserDetailsService userDetailsService;

    @MockitoBean
    private TokenService tokenService;

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    void getConversations_valid() throws Exception {
        User user = new User();
        user.setId(UUID.randomUUID());

        Conversation conversation = new Conversation();
        conversation.setId(UUID.randomUUID());
        conversation.setUser(user);

        when(conversationService.findByUserId(any(UUID.class), any(Pageable.class), anyString()))
                .thenReturn(List.of(ConversationDTO.toDTO(conversation)));

        mockMvc
                .perform(get("/conversations?searchQuery=test")
                        .with(user(new MyUserDetails(user))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0]").value(ConversationDTO.toDTO(conversation)));
    }

    @Test
    void editTitle_valid() throws Exception {
        EditConversationTitleRequest editConversationTitleRequest = new EditConversationTitleRequest();
        editConversationTitleRequest.setTitle("Test Title");

        User user = new User();
        user.setId(UUID.randomUUID());

        Conversation conversation = new Conversation();
        conversation.setId(UUID.randomUUID());
        conversation.setUser(user);

        doNothing().when(conversationService).editTitle(any(UUID.class), any(UUID.class), anyString());

        mockMvc
                .perform(patch("/conversation/" + conversation.getId().toString())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(editConversationTitleRequest))
                        .with(user(new MyUserDetails(user))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Title edited successfully"));

        verify(conversationService).editTitle(conversation.getId(), user.getId(),
                editConversationTitleRequest.getTitle());
    }

    @Test
    void getMessages_valid() throws Exception {
        User user = new User();
        user.setId(UUID.randomUUID());

        Conversation conversation = new Conversation();
        conversation.setId(UUID.randomUUID());
        conversation.setUser(user);

        MessageDTO messageDTO = new MessageDTO();

        when(conversationService.findByIdAndUserId(any(UUID.class), any(UUID.class))).thenReturn(conversation);
        when(messageService.findByConversationId(any(UUID.class), any(Pageable.class))).thenReturn(List.of(messageDTO));

        mockMvc
                .perform(get("/conversation/" + conversation.getId().toString() + "/messages")
                        .with(user(new MyUserDetails(user))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0]").value(messageDTO));

        verify(conversationService).findByIdAndUserId(conversation.getId(), user.getId());
    }

    @Test
    void createConversation_valid() throws Exception {
        User user = new User();
        user.setId(UUID.randomUUID());

        doNothing().when(conversationService).create(any(User.class));

        mockMvc
                .perform(post("/conversation")
                        .with(user(new MyUserDetails(user))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.message").value("Conversation created successfully"));

        verify(conversationService).create(user);
    }

    @Test
    void deleteConversation_valid() throws Exception {
        User user = new User();
        user.setId(UUID.randomUUID());

        Conversation conversation = new Conversation();
        conversation.setId(UUID.randomUUID());
        conversation.setUser(user);

        doNothing().when(conversationService).deleteByIdAndUserId(any(UUID.class), any(UUID.class));

        mockMvc
                .perform(delete("/conversation/" + conversation.getId().toString())
                        .with(user(new MyUserDetails(user))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Conversation deleted successfully"));

        verify(conversationService).deleteByIdAndUserId(conversation.getId(), user.getId());
    }
}
