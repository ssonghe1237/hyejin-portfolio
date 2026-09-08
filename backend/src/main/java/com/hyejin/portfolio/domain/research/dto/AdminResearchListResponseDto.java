package com.hyejin.portfolio.domain.research.dto;

import com.hyejin.portfolio.domain.research.entity.ResearchEntity;

import java.time.LocalDateTime;

/**
 * packageName    : com.hyejin.portfolio.domain.research.dto
 * fileName       : AdminResearchListResponseDto
 * author         : Song
 * date           : 2026-08-03
 * description    : 관리자 Research 게시글 목록 응답 DTO
 *                  - 관리자 Research 전체 목록 조회에 사용
 *                  - 제목, 카테고리, 공개 상태 및 정렬 정보 제공
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-03        Song       최초 생성
 */
public record AdminResearchListResponseDto(

        Long researchId,

        String title,

        String slug,

        String summary,

        String category,

        Integer displayOrder,

        boolean published,

        LocalDateTime createdAt,

        LocalDateTime updatedAt,

        LocalDateTime publishedAt

) {

    public static AdminResearchListResponseDto from(
            ResearchEntity research
    ) {
        return new AdminResearchListResponseDto(
                research.getResearchId(),
                research.getTitle(),
                research.getSlug(),
                research.getSummary(),
                research.getCategory(),
                research.getDisplayOrder(),
                research.isPublished(),
                research.getCreatedAt(),
                research.getUpdatedAt(),
                research.getPublishedAt()
        );
    }
}