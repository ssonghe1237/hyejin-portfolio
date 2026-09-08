package com.hyejin.portfolio.domain.about.dto;

import com.hyejin.portfolio.domain.about.entity.AboutSkillEntity;

/**
 * packageName    : com.hyejin.portfolio.domain.about.dto
 * fileName       : AboutSkillResponseDto
 * author         : Song
 * date           : 2026-08-21
 * description    : 사용자 About 기술 응답 DTO로 내부 ID를 노출하지 않음
 */
public record AboutSkillResponseDto(
        String name, String logoUrl, String description, Integer displayOrder
) {
    public static AboutSkillResponseDto from(AboutSkillEntity entity) {
        return new AboutSkillResponseDto(
                entity.getName(), entity.getLogoUrl(), entity.getDescription(), entity.getDisplayOrder()
        );
    }
}
