package com.himanshu.jbot.service;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Pageable;

import com.himanshu.jbot.dto.ConversationDTO;
import com.himanshu.jbot.entity.Conversation;
import com.himanshu.jbot.entity.User;
import com.himanshu.jbot.exception.JBotException;

public interface ConversationService {
    public List<ConversationDTO> findByUserId(UUID userId, Pageable pageable, String searchQuery);

    public void create(User user);

    public void deleteByIdAndUserId(UUID id, UUID userId) throws JBotException;

    public Conversation findByIdAndUserId(UUID id, UUID userId) throws JBotException;

    public void editTitle(UUID id, UUID userId, String title) throws JBotException;
}
