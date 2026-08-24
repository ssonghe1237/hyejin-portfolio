package com.hyejin.portfolio.domain.about.dto;

import com.hyejin.portfolio.domain.about.entity.AboutSkillEntity;

/**
 * packageName    : com.hyejin.portfolio.domain.about.dto
 * fileName       : AdminAboutSkillResponseDto
 * author         : Song
 * date           : 2026-08-21
 * description    : 관리자 About 기술 편집 복원용 ID 포함 응답 DTO
 */
public record AdminAboutSkillResponseDto(
        Long skillId, String name, String logoUrl, String description, Integer displayOrder
) {
    public static AdminAboutSkillResponseDto from(AboutSkillEntity entity) {
        return new AdminAboutSkillResponseDto(
                entity.getSkillId(), entity.getName(), entity.getLogoUrl(),
                entity.getDescription(), entity.getDisplayOrder()
        );
    }
}
