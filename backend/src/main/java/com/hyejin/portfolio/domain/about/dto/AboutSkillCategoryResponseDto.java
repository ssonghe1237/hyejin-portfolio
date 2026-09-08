package com.hyejin.portfolio.domain.about.dto;

import com.hyejin.portfolio.domain.about.entity.AboutSkillCategoryEntity;

import java.util.List;

/**
 * packageName    : com.hyejin.portfolio.domain.about.dto
 * fileName       : AboutSkillCategoryResponseDto
 * author         : Song
 * date           : 2026-08-21
 * description    : 사용자 About 기술 카테고리와 정렬된 하위 기술 응답 DTO
 */
public record AboutSkillCategoryResponseDto(
        String title, String description, Integer displayOrder,
        List<AboutSkillResponseDto> skills
) {
    public static AboutSkillCategoryResponseDto from(AboutSkillCategoryEntity entity) {
        return new AboutSkillCategoryResponseDto(
                entity.getTitle(), entity.getDescription(), entity.getDisplayOrder(),
                entity.getSkills().stream().map(AboutSkillResponseDto::from).toList()
        );
    }
}
