package com.hyejin.portfolio.domain.about.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDate;

/**
 * packageName    : com.hyejin.portfolio.domain.about.dto
 * fileName       : AdminAboutAwardRequestDto
 * author         : Song
 * date           : 2026-08-20
 * description    : 관리자 About 수상 이력 저장 요청 DTO
 */
public record AdminAboutAwardRequestDto(
        @NotBlank @Size(max = 200) String title,
        @NotBlank @Size(max = 200) String issuer,
        @NotNull LocalDate awardedDate,
        @Size(max = 5000) String description,
        @NotNull @PositiveOrZero Integer displayOrder
) {}
