package com.owlpot.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class EmployeeChangePwdDTO {
    private Long id;
    private String oldPassword;
    private String newPassword;
}
