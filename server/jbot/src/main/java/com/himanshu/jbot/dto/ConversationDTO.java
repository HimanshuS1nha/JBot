package com.himanshu.jbot.dto;

import java.time.LocalDateTime;

import com.himanshu.jbot.entity.Conversation;

import lombok.Data;

@Data
public class ConversationDTO {
    private String id;
    private String title;
    private LocalDateTime createdAt;

    public static ConversationDTO toDTO(Conversation conversation) {
        ConversationDTO conversationDTO = new ConversationDTO();
        conversationDTO.setTitle(conversation.getTitle());
        conversationDTO.setId(conversation.getId().toString());
        conversationDTO.setCreatedAt(conversation.getCreatedAt());

        return conversationDTO;
    }
}
