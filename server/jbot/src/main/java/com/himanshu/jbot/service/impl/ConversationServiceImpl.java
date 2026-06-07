package com.himanshu.jbot.service.impl;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.himanshu.jbot.dto.ConversationDTO;
import com.himanshu.jbot.entity.Conversation;
import com.himanshu.jbot.entity.User;
import com.himanshu.jbot.exception.JBotException;
import com.himanshu.jbot.repository.ConversationRepository;
import com.himanshu.jbot.service.ConversationService;
import com.himanshu.jbot.service.MessageService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ConversationServiceImpl implements ConversationService {
    private final ConversationRepository conversationRepository;
    private final MessageService messageService;

    @Override
    public List<ConversationDTO> findByUserId(UUID userId, Pageable pageable, String searchQuery) {
        return conversationRepository
                .findByUserIdOrderByCreatedAtDesc(userId, searchQuery, pageable)
                .stream()
                .map(ConversationDTO::toDTO)
                .toList();
    }

    @Override
    public void create(User user) {
        Conversation conversation = new Conversation();
        conversation.setUser(user);
        conversation.setTitle("[New Conversation]");
        conversation.setIsTitleModified(false);

        conversationRepository.save(conversation);
    }

    @Transactional
    @Override
    public void deleteByIdAndUserId(UUID id, UUID userId) throws JBotException {
        Conversation conversation = conversationRepository.findById(id)
                .orElseThrow(() -> new JBotException("Conversation not found", HttpStatus.NOT_FOUND));

        if (!userId.equals(conversation.getUser().getId())) {
            // No need to reveal any internal details
            throw new JBotException("Conversation not found", HttpStatus.NOT_FOUND);
        }

        messageService.deleteByConversationId(id);

        conversationRepository.delete(conversation);
    }

    @Override
    public Conversation findByIdAndUserId(UUID id, UUID userId) throws JBotException {
        Conversation conversation = conversationRepository.findById(id)
                .orElseThrow(() -> new JBotException("Conversation not found", HttpStatus.NOT_FOUND));

        if (!userId.equals(conversation.getUser().getId())) {
            // No need to reveal any internal details
            throw new JBotException("Conversation not found", HttpStatus.NOT_FOUND);
        }

        return conversation;
    }

    @Override
    @Transactional
    public void editTitle(UUID id, UUID userId, String title) throws JBotException {
        Conversation conversation = conversationRepository.findByIdAndUserIdWithLock(id, userId)
                .orElseThrow(() -> new JBotException("Conversation not found", HttpStatus.NOT_FOUND));

        conversation.setTitle(title);
        conversation.setIsTitleModified(true);

        conversationRepository.save(conversation);
    }
}
