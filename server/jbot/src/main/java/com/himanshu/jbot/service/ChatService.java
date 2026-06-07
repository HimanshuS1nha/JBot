package com.himanshu.jbot.service;

import java.util.List;

import com.himanshu.jbot.dto.MessageDTO;

public interface ChatService {
    public String generateResponse(List<MessageDTO> messages);

    public String generateTitle(String input);
}
