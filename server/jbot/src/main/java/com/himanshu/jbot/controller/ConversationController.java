package com.himanshu.jbot.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.himanshu.jbot.dto.ConversationDTO;
import com.himanshu.jbot.dto.EditConversationTitleRequest;
import com.himanshu.jbot.dto.MessageDTO;
import com.himanshu.jbot.dto.MessageResponse;
import com.himanshu.jbot.exception.JBotException;
import com.himanshu.jbot.security.MyUserDetails;
import com.himanshu.jbot.service.ConversationService;
import com.himanshu.jbot.service.MessageService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@Validated
public class ConversationController {
    private final ConversationService conversationService;
    private final MessageService messageService;

    @GetMapping("/conversations")
    public ResponseEntity<List<ConversationDTO>> getConversations(@AuthenticationPrincipal MyUserDetails userDetails,
            Pageable pageable, @RequestParam String searchQuery) {
        List<ConversationDTO> conversations = conversationService.findByUserId(userDetails.getUser().getId(),
                pageable, searchQuery);

        return new ResponseEntity<>(conversations, HttpStatus.OK);
    }

    @PatchMapping("/conversation/{conversationId}")
    public ResponseEntity<MessageResponse> editTitle(@AuthenticationPrincipal MyUserDetails userDetails,
            @NotBlank(message = "Conversation ID is required") @PathVariable String conversationId,
            @Valid @RequestBody EditConversationTitleRequest editConversationTitleRequest) throws JBotException {
        conversationService.editTitle(UUID.fromString(conversationId), userDetails.getUser().getId(),
                editConversationTitleRequest.getTitle());

        MessageResponse response = new MessageResponse("Title edited successfully");

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/conversation/{conversationId}/messages")
    public ResponseEntity<List<MessageDTO>> getMessages(@AuthenticationPrincipal MyUserDetails userDetails,
            Pageable pageable, @NotBlank(message = "Conversation ID is required") @PathVariable String conversationId)
            throws JBotException {
        // Checking if the conversation belongs to the user or not
        conversationService.findByIdAndUserId(UUID.fromString(conversationId),
                userDetails.getUser().getId());

        List<MessageDTO> messages = messageService.findByConversationId(UUID.fromString(conversationId), pageable);

        return new ResponseEntity<>(messages, HttpStatus.OK);
    }

    @PostMapping("/conversation")
    public ResponseEntity<MessageResponse> createConversation(@AuthenticationPrincipal MyUserDetails userDetails) {
        conversationService.create(userDetails.getUser());

        MessageResponse response = new MessageResponse("Conversation created successfully");

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @DeleteMapping("/conversation/{conversationId}")
    public ResponseEntity<MessageResponse> deleteConversation(@AuthenticationPrincipal MyUserDetails userDetails,
            @NotBlank(message = "Conversation ID is required") @PathVariable String conversationId)
            throws JBotException {
        conversationService.deleteByIdAndUserId(UUID.fromString(conversationId), userDetails.getUser().getId());

        MessageResponse response = new MessageResponse("Conversation deleted successfully");

        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
