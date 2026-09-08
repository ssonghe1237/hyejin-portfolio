package com.hyejin.portfolio.domain.research.dto;

import com.hyejin.portfolio.domain.research.entity.ResearchEntity;

import java.time.LocalDateTime;

/**
 * packageName    : com.hyejin.portfolio.domain.research.dto
 * fileName       : ResearchListResponseDto
 * author         : Song
 * date           : 2026-08-03
 * description    : 사용자 Research 게시글 목록 응답 DTO
 *                  - 공개 Research 목록 화면에서 사용하는 요약 정보 제공
 *                  - Research 제목, slug, 요약, 카테고리 및 공개일 포함
 *                  - 본문 HTML은 목록 응답에서 제외
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-03        Song       최초 생성
 */
public record ResearchListResponseDto(

        Long researchId,

        String title,

        String slug,

        String summary,

        String category,

        Integer displayOrder,

        LocalDateTime publishedAt,

        LocalDateTime updatedAt

) {

    public static ResearchListResponseDto from(
            ResearchEntity research
    ) {
        return new ResearchListResponseDto(
                research.getResearchId(),
                research.getTitle(),
                research.getSlug(),
                research.getSummary(),
                research.getCategory(),
                research.getDisplayOrder(),
                research.getPublishedAt(),
                research.getUpdatedAt()
        );
    }
}