package com.hyejin.portfolio.domain.about.dto;

import com.hyejin.portfolio.domain.about.entity.AboutEmploymentType;
import jakarta.validation.constraints.*;
import java.time.LocalDate;

/**
 * packageName    : com.hyejin.portfolio.domain.about.dto
 * fileName       : AdminAboutWorkExperienceRequestDto
 * author         : Song
 * date           : 2026-08-20
 * description    : 관리자 About 근무 이력 저장 요청 DTO
 */
public record AdminAboutWorkExperienceRequestDto(
        @NotBlank @Size(max = 200) String companyName,
        @NotBlank @Size(max = 200) String positionTitle,
        @NotNull AboutEmploymentType employmentType,
        @NotNull LocalDate startDate,
        LocalDate endDate,
        @NotBlank String descriptionHtml,
        @NotNull @PositiveOrZero Integer displayOrder
) {}
