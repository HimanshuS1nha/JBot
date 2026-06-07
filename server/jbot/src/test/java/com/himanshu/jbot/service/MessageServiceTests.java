package com.himanshu.jbot.service;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Pageable;

import com.himanshu.jbot.dto.MessageDTO;
import com.himanshu.jbot.entity.Conversation;
import com.himanshu.jbot.entity.Message;
import com.himanshu.jbot.enums.MessageRole;
import com.himanshu.jbot.repository.MessageRepository;
import com.himanshu.jbot.service.impl.MessageServiceImpl;

@ExtendWith(MockitoExtension.class)
public class MessageServiceTests {
    @Mock
    private MessageRepository messageRepository;

    @InjectMocks
    private MessageServiceImpl messageService;

    @Test
    void create_valid() throws Exception {
        Conversation conversation = new Conversation();

        when(messageRepository.save(any(Message.class))).thenReturn(new Message());

        assertDoesNotThrow(() -> messageService.create(conversation, "Test", MessageRole.User));

        verify(messageRepository).save(any(Message.class));
    }

    @Test
    void findByConversationId_valid() throws Exception {
        Message message = new Message();
        message.setContent("Test message");
        message.setId(UUID.randomUUID());
        message.setRole(MessageRole.User);

        UUID conversationId = UUID.randomUUID();

        when(messageRepository.findByConversationIdOrderByCreatedAtDesc(any(UUID.class), any(Pageable.class)))
                .thenReturn(List.of(message));

        assertEquals(messageService.findByConversationId(conversationId, Pageable.ofSize(10)),
                List.of(MessageDTO.toDTO(message)));
    }

    @Test
    void deleteByConversationId_valid() throws Exception {
        UUID conversationId = UUID.randomUUID();

        doNothing().when(messageRepository).deleteByConversationId(any(UUID.class));

        assertDoesNotThrow(() -> messageService.deleteByConversationId(conversationId));

        verify(messageRepository).deleteByConversationId(conversationId);
    }
}
