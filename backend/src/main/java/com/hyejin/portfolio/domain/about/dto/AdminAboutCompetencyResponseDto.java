package com.hyejin.portfolio.domain.about.dto;

import com.hyejin.portfolio.domain.about.entity.AboutCompetencyEntity;

/**
 * packageName    : com.hyejin.portfolio.domain.about.dto
 * fileName       : AdminAboutCompetencyResponseDto
 * author         : Song
 * date           : 2026-08-07
 * description    : 관리자 About 핵심 역량 응답 DTO
 *                  - 저장된 핵심 역량 식별값 제공
 *                  - 핵심 역량 제목, 설명, 표시 순서 제공
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-07        Song       최초 생성
 */
public record AdminAboutCompetencyResponseDto(

        Long competencyId,

        String title,

        String description,

        Integer displayOrder

) {

    public static AdminAboutCompetencyResponseDto from(
            AboutCompetencyEntity competency
    ) {
        return new AdminAboutCompetencyResponseDto(
                competency.getCompetencyId(),
                competency.getTitle(),
                competency.getDescription(),
                competency.getDisplayOrder()
        );
    }
}