package com.hyejin.portfolio.domain.project.dto;

import com.hyejin.portfolio.domain.project.entity.ProjectImageEntity;
import com.hyejin.portfolio.domain.project.entity.ProjectImageType;

/**
 * packageName    : com.hyejin.portfolio.domain.project.dto
 * fileName       : ProjectImageResponseDto
 * author         : Song
 * date           : 2026-06-30
 * description    : 프로젝트 이미지 응답 DTO
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-06-30        Song       최초 생성
 */

public record ProjectImageResponseDto(
        Long projectImageId,
        ProjectImageType imageType,
        String imageUrl,
        String caption,
        int displayOrder
) {

    public static ProjectImageResponseDto from(ProjectImageEntity image) {
        return new ProjectImageResponseDto(
                image.getProjectImageId(),
                image.getImageType(),
                image.getImageUrl(),
                image.getCaption(),
                image.getDisplayOrder()
        );
    }
}