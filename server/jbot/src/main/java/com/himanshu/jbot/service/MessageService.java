package com.himanshu.jbot.service;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Pageable;

import com.himanshu.jbot.dto.MessageDTO;
import com.himanshu.jbot.entity.Conversation;
import com.himanshu.jbot.enums.MessageRole;

public interface MessageService {
    public void create(Conversation conversation, String content, MessageRole role);

    public List<MessageDTO> findByConversationId(UUID conversationId, Pageable pageable);

    public void deleteByConversationId(UUID conversationId);
}
