package com.hyejin.portfolio.domain.project.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;

/**
 * packageName    : com.hyejin.portfolio.domain.project.dto
 * fileName       : AdminProjectTechRequestDto
 * author         : Song
 * date           : 2026-07-07
 * description    : 관리자 프로젝트 기술스택 등록 요청 DTO
 *                  - 프로젝트 기술명, 카테고리, 표시 순서 등록
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-07-07        Song       최초 생성
 */

public record AdminProjectTechRequestDto(
        @NotBlank(message = "기술명은 필수입니다.")
        String techName,

        String techCategory,

        @PositiveOrZero(message = "기술스택 표시 순서는 0 이상이어야 합니다.")
        int displayOrder

) {
}
