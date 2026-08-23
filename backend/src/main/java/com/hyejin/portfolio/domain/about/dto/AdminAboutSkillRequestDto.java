package com.hyejin.portfolio.domain.about.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

/**
 * packageName    : com.hyejin.portfolio.domain.about.dto
 * fileName       : AdminAboutSkillRequestDto
 * author         : Song
 * date           : 2026-08-21
 * description    : 관리자 About 기술 저장 요청 DTO
 */
public record AdminAboutSkillRequestDto(
        @NotBlank(message = "기술명은 필수입니다.")
        @Size(max = 100, message = "기술명은 100자 이하여야 합니다.")
        String name,
        String logoUrl,
        @Size(max = 300, message = "기술 설명은 300자 이하여야 합니다.")
        String description,
        @NotNull(message = "기술 표시 순서는 필수입니다.")
        @PositiveOrZero(message = "기술 표시 순서는 0 이상이어야 합니다.")
        Integer displayOrder
) {
}
