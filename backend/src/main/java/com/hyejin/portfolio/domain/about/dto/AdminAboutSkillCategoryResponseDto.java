package com.hyejin.portfolio.domain.about.dto;

import com.hyejin.portfolio.domain.about.entity.AboutSkillCategoryEntity;

import java.util.List;

/**
 * packageName    : com.hyejin.portfolio.domain.about.dto
 * fileName       : AdminAboutSkillCategoryResponseDto
 * author         : Song
 * date           : 2026-08-21
 * description    : 관리자 About 기술 카테고리 편집 복원용 ID 포함 응답 DTO
 */
public record AdminAboutSkillCategoryResponseDto(
        Long skillCategoryId, String title, String description, Integer displayOrder,
        List<AdminAboutSkillResponseDto> skills
) {
    public static AdminAboutSkillCategoryResponseDto from(AboutSkillCategoryEntity entity) {
        return new AdminAboutSkillCategoryResponseDto(
                entity.getSkillCategoryId(), entity.getTitle(), entity.getDescription(), entity.getDisplayOrder(),
                entity.getSkills().stream().map(AdminAboutSkillResponseDto::from).toList()
        );
    }
}
