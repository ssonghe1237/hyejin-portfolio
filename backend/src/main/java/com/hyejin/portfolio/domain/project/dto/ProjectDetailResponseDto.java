package com.hyejin.portfolio.domain.project.dto;

import com.hyejin.portfolio.domain.project.entity.ProjectEntity;
import com.hyejin.portfolio.domain.project.entity.ProjectType;

import java.time.LocalDate;
import java.util.List;

/**
 * packageName    : com.hyejin.portfolio.domain.project.dto
 * fileName       : ProjectDetailResponseDto
 * author         : Song
 * date           : 2026-06-30
 * description    : 프로젝트 상세 응답 DTO
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-06-30        Song       최초 생성
 */

public record ProjectDetailResponseDto(
        Long projectId,
        String title,
        String slug,
        String summary,
        String description,
        ProjectType projectType,
        LocalDate startDate,
        LocalDate endDate,
        String periodText,
        String teamName,
        String role,
        int displayOrder,
        List<ProjectTechResponseDto> techStacks,
        List<ProjectImageResponseDto> images,
        List<ProjectSectionResponseDto> sections,
        List<ProjectLinkResponseDto> links
) {

    public static ProjectDetailResponseDto from(
            ProjectEntity project,
            String periodText,
            List<ProjectTechResponseDto> techStacks,
            List<ProjectImageResponseDto> images,
            List<ProjectSectionResponseDto> sections,
            List<ProjectLinkResponseDto> links
    ) {
        return new ProjectDetailResponseDto(
                project.getProjectId(),
                project.getTitle(),
                project.getSlug(),
                project.getSummary(),
                project.getDescription(),
                project.getProjectType(),
                project.getStartDate(),
                project.getEndDate(),
                periodText,
                project.getTeamName(),
                project.getRole(),
                project.getDisplayOrder(),
                techStacks,
                images,
                sections,
                links
        );
    }
}
