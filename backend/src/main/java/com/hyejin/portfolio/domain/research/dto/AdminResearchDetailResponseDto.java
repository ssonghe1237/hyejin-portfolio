package com.hyejin.portfolio.domain.research.dto;

import com.hyejin.portfolio.domain.research.entity.ResearchEntity;

import java.time.LocalDateTime;

/**
 * packageName    : com.hyejin.portfolio.domain.research.dto
 * fileName       : AdminResearchDetailResponseDto
 * author         : Song
 * date           : 2026-08-03
 * description    : 관리자 Research 게시글 상세 응답 DTO
 *                  - Research 등록 및 상세 조회 응답에 사용
 *                  - 본문 HTML, 공개 상태 및 날짜 정보 포함
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-03        Song       최초 생성
 */
public record AdminResearchDetailResponseDto(

        Long researchId,

        String title,

        String slug,

        String summary,

        String contentHtml,

        String category,

        Integer displayOrder,

        boolean published,

        LocalDateTime createdAt,

        LocalDateTime updatedAt,

        LocalDateTime publishedAt

) {

    public static AdminResearchDetailResponseDto from(
            ResearchEntity research
    ) {
        return new AdminResearchDetailResponseDto(
                research.getResearchId(),
                research.getTitle(),
                research.getSlug(),
                research.getSummary(),
                research.getContentHtml(),
                research.getCategory(),
                research.getDisplayOrder(),
                research.isPublished(),
                research.getCreatedAt(),
                research.getUpdatedAt(),
                research.getPublishedAt()
        );
    }
}