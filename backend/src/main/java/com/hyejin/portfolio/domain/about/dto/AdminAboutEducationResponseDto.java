package com.hyejin.portfolio.domain.about.dto;

import com.hyejin.portfolio.domain.about.entity.AboutEducationEntity;
import com.hyejin.portfolio.domain.about.entity.AboutEducationType;
import java.time.LocalDate;

/**
 * packageName    : com.hyejin.portfolio.domain.about.dto
 * fileName       : AdminAboutEducationResponseDto
 * author         : Song
 * date           : 2026-08-20
 * description    : 관리자 About 교육 이력 응답 DTO
 */
public record AdminAboutEducationResponseDto(
        Long educationId, AboutEducationType educationType, String institutionName,
        String courseName, LocalDate startDate, LocalDate endDate, String status,
        String description, Integer displayOrder
) {
    public static AdminAboutEducationResponseDto from(AboutEducationEntity entity) {
        return new AdminAboutEducationResponseDto(entity.getEducationId(), entity.getEducationType(),
                entity.getInstitutionName(), entity.getCourseName(), entity.getStartDate(), entity.getEndDate(),
                entity.getStatus(), entity.getDescription(), entity.getDisplayOrder());
    }
}
