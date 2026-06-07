package com.himanshu.jbot.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.himanshu.jbot.dto.MessageDTO;
import com.himanshu.jbot.dto.MessageResponse;
import com.himanshu.jbot.entity.Conversation;
import com.himanshu.jbot.enums.MessageRole;
import com.himanshu.jbot.exception.JBotException;
import com.himanshu.jbot.security.MyUserDetails;
import com.himanshu.jbot.service.ChatService;
import com.himanshu.jbot.service.ConversationService;
import com.himanshu.jbot.service.MessageService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/ai")
@RequiredArgsConstructor
@Validated
public class AIController {
    private final ChatService chatService;
    private final MessageService messageService;
    private final ConversationService conversationService;;

    @PostMapping("/{conversationId}/chat")
    @Transactional
    public ResponseEntity<MessageResponse> generateResponse(@Valid @RequestBody List<MessageDTO> messages,
            @NotBlank @PathVariable String conversationId, @AuthenticationPrincipal MyUserDetails userDetails)
            throws JBotException {
        Conversation conversation = conversationService.findByIdAndUserId(UUID.fromString(conversationId),
                userDetails.getUser().getId());

        messageService.create(conversation, messages.get(messages.size() - 1).getContent(), MessageRole.User);
        String content = chatService.generateResponse(messages);

        messageService.create(conversation, content, MessageRole.Assistant);

        MessageResponse response = new MessageResponse(content);

        if (!conversation.getIsTitleModified()) {
            conversationService.editTitle(conversation.getId(), userDetails.getUser().getId(),
                    chatService.generateTitle(messages.get(messages.size() - 1).getContent()));
        }

        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
