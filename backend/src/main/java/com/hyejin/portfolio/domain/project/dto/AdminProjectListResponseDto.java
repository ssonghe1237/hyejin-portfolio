package com.hyejin.portfolio.domain.project.dto;

import com.hyejin.portfolio.domain.project.entity.ProjectEntity;
import com.hyejin.portfolio.domain.project.entity.ProjectType;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * packageName    : com.hyejin.portfolio.domain.project.dto
 * fileName       : AdminProjectListResponseDto
 * author         : Song
 * date           : 2026-07-02
 * description    : 관리자 프로젝트 목록 응답 DTO
 *                  - 관리자 화면에서 프로젝트 목록 조회 시 사용
 *                  - 공개 여부와 생성/수정 일시 포함
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-07-02        Song       최초 생성
 */
public record AdminProjectListResponseDto(
        Long projectId,
        String title,
        String slug,
        String summary,
        ProjectType projectType,
        LocalDate startDate,
        LocalDate endDate,
        String teamName,
        String role,
        int displayOrder,
        boolean published,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {

    public static AdminProjectListResponseDto from(ProjectEntity project) {
        return new AdminProjectListResponseDto(
                project.getProjectId(),
                project.getTitle(),
                project.getSlug(),
                project.getSummary(),
                project.getProjectType(),
                project.getStartDate(),
                project.getEndDate(),
                project.getTeamName(),
                project.getRole(),
                project.getDisplayOrder(),
                project.isPublished(),
                project.getCreatedAt(),
                project.getUpdatedAt()
        );
    }
}