package com.himanshu.jbot.dto;

import com.himanshu.jbot.entity.Message;
import com.himanshu.jbot.enums.MessageRole;

import lombok.Data;

@Data
public class MessageDTO {
    private String id;
    private String content;
    private MessageRole role;

    public static MessageDTO toDTO(Message message) {
        MessageDTO messageDTO = new MessageDTO();
        messageDTO.setId(message.getId().toString());
        messageDTO.setContent(message.getContent());
        messageDTO.setRole(message.getRole());

        return messageDTO;
    }
}
