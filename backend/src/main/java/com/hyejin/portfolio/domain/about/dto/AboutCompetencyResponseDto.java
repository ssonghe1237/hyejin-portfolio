package com.hyejin.portfolio.domain.about.dto;

import com.hyejin.portfolio.domain.about.entity.AboutCompetencyEntity;

/**
 * packageName    : com.hyejin.portfolio.domain.about.dto
 * fileName       : AboutCompetencyResponseDto
 * author         : Song
 * date           : 2026-08-07
 * description    : 사용자 공개 About 핵심 역량 응답 DTO
 *                  - Home 및 About 페이지 공통 핵심 역량 제공
 *                  - 핵심 역량 제목, 설명, 표시 순서 제공
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-07        Song       최초 생성
 */
public record AboutCompetencyResponseDto(

        String title,

        String description,

        Integer displayOrder

) {

    public static AboutCompetencyResponseDto from(
            AboutCompetencyEntity competency
    ) {
        return new AboutCompetencyResponseDto(
                competency.getTitle(),
                competency.getDescription(),
                competency.getDisplayOrder()
        );
    }
}