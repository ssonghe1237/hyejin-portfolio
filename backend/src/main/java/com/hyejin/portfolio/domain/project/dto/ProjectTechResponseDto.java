package com.hyejin.portfolio.domain.project.dto;

import com.hyejin.portfolio.domain.project.entity.ProjectTechEntity;

/**
 * packageName    : com.hyejin.portfolio.domain.project.dto
 * fileName       : ProjectTechResponseDto
 * author         : Song
 * date           : 2026-06-30
 * description    : 프로젝트 기술스택 응답 DTO
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-06-30        Song       최초 생성
 */
public record ProjectTechResponseDto(
        Long projectTechId,
        String techName,
        String techCategory,
        int displayOrder
) {
    public static ProjectTechResponseDto from(ProjectTechEntity tech) {
        return new ProjectTechResponseDto(
                tech.getProjectTechId(),
                tech.getTechName(),
                tech.getTechCategory(),
                tech.getDisplayOrder()
        );
    }
}
