package com.hyejin.portfolio.domain.research.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

/**
 * packageName    : com.hyejin.portfolio.domain.research.dto
 * fileName       : AdminResearchUpdateRequestDto
 * author         : Song
 * date           : 2026-08-03
 * description    : 관리자 Research 게시글 수정 요청 DTO
 *                  - Research 제목, slug, 요약 및 Tiptap 본문 HTML 수정
 *                  - 카테고리, 노출 순서 및 공개 여부 수정
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-03        Song       최초 생성
 */
public record AdminResearchUpdateRequestDto(

        @NotBlank(message = "Research 제목은 필수입니다.")
        @Size(
                max = 200,
                message = "Research 제목은 200자를 초과할 수 없습니다."
        )
        String title,

        @NotBlank(message = "Research slug는 필수입니다.")
        @Size(
                max = 200,
                message = "Research slug는 200자를 초과할 수 없습니다."
        )
        @Pattern(
                regexp = "^[a-z0-9]+(?:-[a-z0-9]+)*$",
                message = "slug는 영문 소문자, 숫자, 하이픈만 사용할 수 있습니다."
        )
        String slug,

        @NotBlank(message = "Research 요약은 필수입니다.")
        String summary,

        @NotBlank(message = "Research 본문은 필수입니다.")
        String contentHtml,

        @NotBlank(message = "Research 카테고리는 필수입니다.")
        @Size(
                max = 100,
                message = "Research 카테고리는 100자를 초과할 수 없습니다."
        )
        String category,

        @PositiveOrZero(
                message = "Research 표시 순서는 0 이상이어야 합니다."
        )
        int displayOrder,

        @NotNull(message = "Research 공개 여부는 필수입니다.")
        Boolean published

) {
}