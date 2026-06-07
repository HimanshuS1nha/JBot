package com.himanshu.jbot.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class EditConversationTitleRequest {
    @NotBlank
    private String title;
}
