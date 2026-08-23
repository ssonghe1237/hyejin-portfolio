package com.hyejin.portfolio.domain.about.dto;

import com.hyejin.portfolio.domain.about.entity.AboutEmploymentType;
import com.hyejin.portfolio.domain.about.entity.AboutWorkExperienceEntity;
import java.time.LocalDate;

/**
 * packageName    : com.hyejin.portfolio.domain.about.dto
 * fileName       : AboutWorkExperienceResponseDto
 * author         : Song
 * date           : 2026-08-20
 * description    : 사용자 About 근무 이력 응답 DTO
 */
public record AboutWorkExperienceResponseDto(
        String companyName, String positionTitle, AboutEmploymentType employmentType,
        LocalDate startDate, LocalDate endDate, String descriptionHtml, Integer displayOrder
) {
    public static AboutWorkExperienceResponseDto from(AboutWorkExperienceEntity entity) {
        return new AboutWorkExperienceResponseDto(entity.getCompanyName(), entity.getPositionTitle(),
                entity.getEmploymentType(), entity.getStartDate(), entity.getEndDate(),
                entity.getDescriptionHtml(), entity.getDisplayOrder());
    }
}
