package com.hyejin.portfolio.domain.project.dto;

import com.hyejin.portfolio.domain.project.entity.ProjectEntity;
import com.hyejin.portfolio.domain.project.entity.ProjectType;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * packageName    : com.hyejin.portfolio.domain.project.dto
 * fileName       : AdminProjectDetailResponseDto
 * author         : Song
 * date           : 2026-07-02
 * description    : 관리자 프로젝트 상세 응답 DTO
 *                  - 관리자 화면에서 프로젝트 상세 조회 시 사용
 *                  - 공개 여부, 이미지, 섹션, 기술스택, 링크 정보 포함
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-07-02        Song       최초 생성
 * 2026-07-07        Song       썸네일 이미지 응답 추가
 */
public record AdminProjectDetailResponseDto(
        Long projectId,
        String title,
        String slug,
        String summary,
        String description,
        ProjectType projectType,
        LocalDate startDate,
        LocalDate endDate,
        String teamName,
        String role,
        int displayOrder,
        boolean published,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        ProjectImageResponseDto thumbnailImage,
        List<ProjectImageResponseDto> heroImages,
        List<ProjectTechResponseDto> techStacks,
        List<ProjectSectionResponseDto> sections,
        List<ProjectLinkResponseDto> links
) {

    public static AdminProjectDetailResponseDto from(
            ProjectEntity project,
            ProjectImageResponseDto thumbnailImage,
            List<ProjectImageResponseDto> heroImages,
            List<ProjectTechResponseDto> techStacks,
            List<ProjectSectionResponseDto> sections,
            List<ProjectLinkResponseDto> links
    ) {
        return new AdminProjectDetailResponseDto(
                project.getProjectId(),
                project.getTitle(),
                project.getSlug(),
                project.getSummary(),
                project.getDescription(),
                project.getProjectType(),
                project.getStartDate(),
                project.getEndDate(),
                project.getTeamName(),
                project.getRole(),
                project.getDisplayOrder(),
                project.isPublished(),
                project.getCreatedAt(),
                project.getUpdatedAt(),
                thumbnailImage,
                heroImages,
                techStacks,
                sections,
                links
        );
    }
}