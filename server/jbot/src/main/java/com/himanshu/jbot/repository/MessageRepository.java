package com.himanshu.jbot.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;

import com.himanshu.jbot.entity.Message;

public interface MessageRepository extends JpaRepository<Message, UUID> {
    public List<Message> findByConversationIdOrderByCreatedAtDesc(UUID conversationId, Pageable pageable);

    @Modifying
    public void deleteByConversationId(UUID conversationId);
}
