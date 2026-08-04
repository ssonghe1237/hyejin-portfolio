package com.hyejin.portfolio.domain.research.dto;

import com.hyejin.portfolio.domain.research.entity.ResearchEntity;

import java.time.LocalDateTime;

/**
 * packageName    : com.hyejin.portfolio.domain.research.dto
 * fileName       : ResearchDetailResponseDto
 * author         : Song
 * date           : 2026-08-03
 * description    : 사용자 Research 게시글 상세 응답 DTO
 *                  - 공개 Research 상세 페이지 정보 제공
 *                  - Tiptap으로 작성하고 서버에서 정제한 본문 HTML 포함
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-03        Song       최초 생성
 */
public record ResearchDetailResponseDto(

        Long researchId,

        String title,

        String slug,

        String summary,

        String contentHtml,

        String category,

        LocalDateTime publishedAt,

        LocalDateTime updatedAt

) {

    public static ResearchDetailResponseDto from(
            ResearchEntity research
    ) {
        return new ResearchDetailResponseDto(
                research.getResearchId(),
                research.getTitle(),
                research.getSlug(),
                research.getSummary(),
                research.getContentHtml(),
                research.getCategory(),
                research.getPublishedAt(),
                research.getUpdatedAt()
        );
    }
}