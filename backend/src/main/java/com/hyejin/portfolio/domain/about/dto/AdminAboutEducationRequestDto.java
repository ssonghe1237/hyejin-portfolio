package com.hyejin.portfolio.domain.about.dto;

import com.hyejin.portfolio.domain.about.entity.AboutEducationType;
import jakarta.validation.constraints.*;
import java.time.LocalDate;

/**
 * packageName    : com.hyejin.portfolio.domain.about.dto
 * fileName       : AdminAboutEducationRequestDto
 * author         : Song
 * date           : 2026-08-20
 * description    : 관리자 About 교육 이력 저장 요청 DTO
 */
public record AdminAboutEducationRequestDto(
        @NotNull AboutEducationType educationType,
        @NotBlank @Size(max = 200) String institutionName,
        @NotBlank @Size(max = 300) String courseName,
        @NotNull LocalDate startDate,
        LocalDate endDate,
        @Size(max = 100) String status,
        @Size(max = 5000) String description,
        @NotNull @PositiveOrZero Integer displayOrder
) {}
