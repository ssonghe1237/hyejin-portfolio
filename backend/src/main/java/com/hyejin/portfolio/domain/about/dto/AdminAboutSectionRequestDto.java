package com.hyejin.portfolio.domain.about.dto;

import com.hyejin.portfolio.domain.about.entity.AboutSectionType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

/**
 * packageName    : com.hyejin.portfolio.domain.about.dto
 * fileName       : AdminAboutSectionRequestDto
 * author         : Song
 * date           : 2026-08-04
 * description    : 관리자 About 섹션 저장 요청 DTO
 *                  - About 섹션 제목과 Tiptap HTML 본문 전달
 *                  - 사용자 화면 표시 순서 전달
 *                  - About 섹션 역할 유형 전달
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-04        Song       최초 생성
 * 2026-08-24        Song       About 섹션 유형 저장 요청 구조 추가
 */
public record AdminAboutSectionRequestDto(

        @NotBlank(message = "About 섹션 제목은 필수입니다.")
        @Size(
                max = 150,
                message = "About 섹션 제목은 150자 이하여야 합니다."
        )
        String title,

        @NotBlank(message = "About 섹션 본문은 필수입니다.")
        String contentHtml,

        @NotNull(message = "About 섹션 유형은 필수입니다.")
        AboutSectionType sectionType,

        @NotNull(message = "About 섹션 표시 순서는 필수입니다.")
        @PositiveOrZero(
                message = "About 섹션 표시 순서는 0 이상이어야 합니다."
        )
        Integer displayOrder

) {
}
