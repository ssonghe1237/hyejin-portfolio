package com.hyejin.portfolio.domain.about.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

/**
 * packageName    : com.hyejin.portfolio.domain.about.dto
 * fileName       : AdminAboutCompetencyRequestDto
 * author         : Song
 * date           : 2026-08-07
 * description    : 관리자 About 핵심 역량 저장 요청 DTO
 *                  - 핵심 역량 제목과 설명 전달
 *                  - Home 및 About 화면 표시 순서 전달
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-07        Song       최초 생성
 */
public record AdminAboutCompetencyRequestDto(

        @NotBlank(
                message = "핵심 역량 제목은 필수입니다."
        )
        @Size(
                max = 150,
                message = "핵심 역량 제목은 150자 이하여야 합니다."
        )
        String title,

        @NotBlank(
                message = "핵심 역량 설명은 필수입니다."
        )
        @Size(
                max = 1000,
                message = "핵심 역량 설명은 1000자 이하여야 합니다."
        )
        String description,

        @NotNull(
                message = "핵심 역량 표시 순서는 필수입니다."
        )
        @PositiveOrZero(
                message = "핵심 역량 표시 순서는 0 이상이어야 합니다."
        )
        Integer displayOrder

) {
}