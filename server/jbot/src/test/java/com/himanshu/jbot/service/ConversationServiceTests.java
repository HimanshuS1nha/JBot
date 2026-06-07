package com.himanshu.jbot.service;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;

import com.himanshu.jbot.dto.ConversationDTO;
import com.himanshu.jbot.entity.Conversation;
import com.himanshu.jbot.entity.User;
import com.himanshu.jbot.exception.JBotException;
import com.himanshu.jbot.repository.ConversationRepository;
import com.himanshu.jbot.service.impl.ConversationServiceImpl;
import com.himanshu.jbot.service.impl.MessageServiceImpl;

@ExtendWith(MockitoExtension.class)
public class ConversationServiceTests {
    @Mock
    private ConversationRepository conversationRepository;

    @Mock
    private MessageServiceImpl messageService;

    @InjectMocks
    private ConversationServiceImpl conversationService;

    @Test
    void findByUserId_valid() throws Exception {
        UUID userId = UUID.randomUUID();
        String searchQuery = "";
        Pageable pageable = Pageable.ofSize(10);

        Conversation conversation = new Conversation();
        conversation.setId(UUID.randomUUID());
        conversation.setTitle("Test Conversation");
        conversation.setCreatedAt(LocalDateTime.now());

        when(conversationRepository.findByUserIdOrderByCreatedAtDesc(userId, searchQuery, pageable))
                .thenReturn(new PageImpl<>(List.of(conversation)));

        assertEquals(List.of(ConversationDTO.toDTO(conversation)),
                conversationService.findByUserId(userId, pageable, searchQuery));
    }

    @Test
    void create_valid() throws Exception {
        User user = new User();

        when(conversationRepository.save(any(Conversation.class))).thenReturn(new Conversation());

        assertDoesNotThrow(() -> conversationService.create(user));
    }

    @Test
    void editTitle_valid() throws Exception {
        UUID id = UUID.randomUUID();
        UUID userId = UUID.randomUUID();

        Conversation conversation = new Conversation();

        when(conversationRepository.findByIdAndUserIdWithLock(id, userId)).thenReturn(Optional.of(conversation));
        when(conversationRepository.save(any(Conversation.class))).thenReturn(conversation);

        assertDoesNotThrow(() -> conversationService.editTitle(id, userId, "Test title"));
    }

    @Test
    void editTitle_invalid_notFound() throws Exception {
        String exceptionMessage = "Conversation not found";

        UUID id = UUID.randomUUID();
        UUID userId = UUID.randomUUID();

        when(conversationRepository.findByIdAndUserIdWithLock(id, userId)).thenReturn(Optional.empty());

        JBotException exception = assertThrows(JBotException.class,
                () -> conversationService.editTitle(id, userId, "Test title"));

        assertEquals(exceptionMessage, exception.getMessage());
        assertEquals(HttpStatus.NOT_FOUND, exception.getCode());
    }

    @Test
    void findByIdAndUserId_valid() throws Exception {
        User user = new User();
        user.setId(UUID.randomUUID());

        Conversation conversation = new Conversation();
        conversation.setId(UUID.randomUUID());
        conversation.setUser(user);

        when(conversationRepository.findById(any(UUID.class))).thenReturn(Optional.of(conversation));

        assertEquals(conversation, conversationService.findByIdAndUserId(conversation.getId(), user.getId()));
    }

    @Test
    void findByIdAndUserId_invalid_notFound() throws Exception {
        String exceptionMessage = "Conversation not found";

        User user = new User();
        user.setId(UUID.randomUUID());

        Conversation conversation = new Conversation();
        conversation.setId(UUID.randomUUID());
        conversation.setUser(user);

        when(conversationRepository.findById(any(UUID.class))).thenReturn(Optional.empty());

        JBotException exception = assertThrows(JBotException.class,
                () -> conversationService.findByIdAndUserId(conversation.getId(), user.getId()));

        assertEquals(exceptionMessage, exception.getMessage());
        assertEquals(HttpStatus.NOT_FOUND, exception.getCode());
    }

    @Test
    void findByIdAndUserId_invalid_wrongUser() throws Exception {
        String exceptionMessage = "Conversation not found";

        User user1 = new User();
        user1.setId(UUID.randomUUID());

        User user2 = new User();
        user2.setId(UUID.randomUUID());

        Conversation conversation = new Conversation();
        conversation.setId(UUID.randomUUID());
        conversation.setUser(user2);

        when(conversationRepository.findById(any(UUID.class))).thenReturn(Optional.of(conversation));

        JBotException exception = assertThrows(JBotException.class,
                () -> conversationService.findByIdAndUserId(conversation.getId(), user1.getId()));

        assertEquals(exceptionMessage, exception.getMessage());
        assertEquals(HttpStatus.NOT_FOUND, exception.getCode());
    }

    @Test
    void deleteByIdAndUserId_valid() throws Exception {
        User user = new User();
        user.setId(UUID.randomUUID());

        Conversation conversation = new Conversation();
        conversation.setId(UUID.randomUUID());
        conversation.setUser(user);

        when(conversationRepository.findById(any(UUID.class))).thenReturn(Optional.of(conversation));
        doNothing().when(messageService).deleteByConversationId(any(UUID.class));
        doNothing().when(conversationRepository).delete(any(Conversation.class));

        assertDoesNotThrow(() -> conversationService.deleteByIdAndUserId(conversation.getId(), user.getId()));

        verify(messageService).deleteByConversationId(any(UUID.class));
        verify(conversationRepository).delete(any(Conversation.class));
    }

    @Test
    void deleteByIdAndUserId_invalid_notFound() throws Exception {
        String exceptionMessage = "Conversation not found";

        User user = new User();
        user.setId(UUID.randomUUID());

        Conversation conversation = new Conversation();
        conversation.setId(UUID.randomUUID());
        conversation.setUser(user);

        when(conversationRepository.findById(any(UUID.class))).thenReturn(Optional.empty());

        JBotException exception = assertThrows(JBotException.class,
                () -> conversationService.deleteByIdAndUserId(conversation.getId(), user.getId()));

        assertEquals(exceptionMessage, exception.getMessage());
        assertEquals(HttpStatus.NOT_FOUND, exception.getCode());
    }

    @Test
    void deleteByIdAndUserId_invalid_wrongUser() throws Exception {
        String exceptionMessage = "Conversation not found";

        User user1 = new User();
        user1.setId(UUID.randomUUID());

        User user2 = new User();
        user2.setId(UUID.randomUUID());

        Conversation conversation = new Conversation();
        conversation.setId(UUID.randomUUID());
        conversation.setUser(user2);

        when(conversationRepository.findById(any(UUID.class))).thenReturn(Optional.empty());

        JBotException exception = assertThrows(JBotException.class,
                () -> conversationService.deleteByIdAndUserId(conversation.getId(), user1.getId()));

        assertEquals(exceptionMessage, exception.getMessage());
        assertEquals(HttpStatus.NOT_FOUND, exception.getCode());
    }
}
