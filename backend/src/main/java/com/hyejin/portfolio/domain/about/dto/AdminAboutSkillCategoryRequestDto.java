package com.hyejin.portfolio.domain.about.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.util.List;

/**
 * packageName    : com.hyejin.portfolio.domain.about.dto
 * fileName       : AdminAboutSkillCategoryRequestDto
 * author         : Song
 * date           : 2026-08-21
 * description    : 관리자 About 기술 카테고리와 하위 기술 목록 저장 요청 DTO
 */
public record AdminAboutSkillCategoryRequestDto(
        @NotBlank(message = "기술 카테고리 제목은 필수입니다.")
        @Size(max = 150, message = "기술 카테고리 제목은 150자 이하여야 합니다.")
        String title,
        @Size(max = 500, message = "기술 카테고리 설명은 500자 이하여야 합니다.")
        String description,
        @NotNull(message = "기술 카테고리 표시 순서는 필수입니다.")
        @PositiveOrZero(message = "기술 카테고리 표시 순서는 0 이상이어야 합니다.")
        Integer displayOrder,
        @NotNull(message = "기술 목록은 필수입니다.")
        @Size(max = 30, message = "카테고리별 기술은 최대 30개까지 등록할 수 있습니다.")
        List<@NotNull @Valid AdminAboutSkillRequestDto> skills
) {
}
