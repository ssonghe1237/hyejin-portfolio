package com.hyejin.portfolio.domain.project.dto;

import com.hyejin.portfolio.domain.project.entity.ProjectSectionEntity;
import com.hyejin.portfolio.domain.project.entity.ProjectSectionType;

/**
 * packageName    : com.hyejin.portfolio.domain.project.dto
 * fileName       : ProjectSectionResponseDto
 * author         : Song
 * date           : 2026-06-30
 * description    : 프로젝트 상세 섹션 응답 DTO
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-06-30        Song       최초 생성
 */

public record ProjectSectionResponseDto(
        Long sectionId,
        ProjectSectionType sectionType,
        String title,
        String content,
        int displayOrder
) {

    public static ProjectSectionResponseDto from(ProjectSectionEntity section) {
        return new ProjectSectionResponseDto(
                section.getSectionId(),
                section.getSectionType(),
                section.getTitle(),
                section.getContent(),
                section.getDisplayOrder()
        );
    }
}
