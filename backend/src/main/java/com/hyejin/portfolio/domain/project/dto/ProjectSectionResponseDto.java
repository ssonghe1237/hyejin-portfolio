package com.hyejin.portfolio.domain.project.dto;

import com.hyejin.portfolio.domain.project.entity.ProjectSectionEntity;
import com.hyejin.portfolio.domain.project.entity.ProjectSectionType;

import java.util.List;

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
 * 2026-07-02        Song       섹션 별 이미지 목록 추가
 */

public record ProjectSectionResponseDto(
        Long sectionId,
        ProjectSectionType sectionType,
        String title,
        String content,
        int displayOrder,
        List<ProjectImageResponseDto> images
) {

    public static ProjectSectionResponseDto from(
            ProjectSectionEntity section,
            List<ProjectImageResponseDto> images
    ) {
        return new ProjectSectionResponseDto(
                section.getSectionId(),
                section.getSectionType(),
                section.getTitle(),
                section.getContent(),
                section.getDisplayOrder(),
                images
        );
    }
}
