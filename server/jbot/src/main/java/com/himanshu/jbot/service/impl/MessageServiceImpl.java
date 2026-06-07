package com.himanshu.jbot.service.impl;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.himanshu.jbot.dto.MessageDTO;
import com.himanshu.jbot.entity.Conversation;
import com.himanshu.jbot.entity.Message;
import com.himanshu.jbot.enums.MessageRole;
import com.himanshu.jbot.repository.MessageRepository;
import com.himanshu.jbot.service.MessageService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MessageServiceImpl implements MessageService {
    private final MessageRepository messageRepository;

    @Override
    public void create(Conversation conversation, String content, MessageRole role) {
        Message message = new Message();
        message.setContent(content);
        message.setConversation(conversation);
        message.setRole(role);

        messageRepository.save(message);
    }

    @Override
    public List<MessageDTO> findByConversationId(UUID conversationId, Pageable pageable) {
        return messageRepository
                .findByConversationIdOrderByCreatedAtDesc(conversationId, pageable)
                .stream()
                .map(MessageDTO::toDTO)
                .toList();

    }

    @Override
    public void deleteByConversationId(UUID conversationId) {
        messageRepository.deleteByConversationId(conversationId);
    }

}
