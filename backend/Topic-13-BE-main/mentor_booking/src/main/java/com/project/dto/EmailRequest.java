package com.project.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EmailRequest {

    // Class data members
    @NotBlank(message = "Recipient is required")
    private String recipient;
    @NotBlank(message = "Body is required")
    private String msgBody;
    @NotBlank(message = "Subject is required")
    private String subject;
    @NotBlank(message = "Attachment is required")
    private String attachment;
}
