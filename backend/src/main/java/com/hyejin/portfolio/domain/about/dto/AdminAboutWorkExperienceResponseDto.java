package com.hyejin.portfolio.domain.about.dto;

import com.hyejin.portfolio.domain.about.entity.AboutEmploymentType;
import com.hyejin.portfolio.domain.about.entity.AboutWorkExperienceEntity;
import java.time.LocalDate;

/**
 * packageName    : com.hyejin.portfolio.domain.about.dto
 * fileName       : AdminAboutWorkExperienceResponseDto
 * author         : Song
 * date           : 2026-08-20
 * description    : 관리자 About 근무 이력 응답 DTO
 */
public record AdminAboutWorkExperienceResponseDto(
        Long experienceId, String companyName, String positionTitle,
        AboutEmploymentType employmentType, LocalDate startDate, LocalDate endDate,
        String descriptionHtml, Integer displayOrder
) {
    public static AdminAboutWorkExperienceResponseDto from(AboutWorkExperienceEntity entity) {
        return new AdminAboutWorkExperienceResponseDto(entity.getExperienceId(), entity.getCompanyName(),
                entity.getPositionTitle(), entity.getEmploymentType(), entity.getStartDate(), entity.getEndDate(),
                entity.getDescriptionHtml(), entity.getDisplayOrder());
    }
}
