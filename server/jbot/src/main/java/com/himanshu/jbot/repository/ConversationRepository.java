package com.himanshu.jbot.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.himanshu.jbot.entity.Conversation;

import jakarta.persistence.LockModeType;

public interface ConversationRepository extends JpaRepository<Conversation, UUID> {
    @Query("SELECT c FROM Conversation c WHERE c.user.id = ?1 AND LOWER(c.title) LIKE LOWER(CONCAT('%', ?2, '%')) ORDER BY c.createdAt DESC")
    public Page<Conversation> findByUserIdOrderByCreatedAtDesc(UUID userId, String searchQuery, Pageable pageable);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT c from Conversation c WHERE c.id = ?1 AND c.user.id = ?2")
    public Optional<Conversation> findByIdAndUserIdWithLock(UUID id, UUID userId);

    @Modifying
    public void deleteByUserId(UUID userId);
}
