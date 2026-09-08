package com.hyejin.portfolio.domain.research.dto;

import jakarta.validation.constraints.NotNull;

/**
 * packageName    : com.hyejin.portfolio.domain.research.dto
 * fileName       : AdminResearchPublicationUpdateRequestDto
 * author         : Song
 * date           : 2026-08-03
 * description    : 관리자 Research 공개 상태 변경 요청 DTO
 *                  - Research 게시글 공개 또는 비공개 상태 변경
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-03        Song       최초 생성
 */
public record AdminResearchPublicationUpdateRequestDto(

        @NotNull(message = "Research 공개 여부는 필수입니다.")
        Boolean published

) {
}