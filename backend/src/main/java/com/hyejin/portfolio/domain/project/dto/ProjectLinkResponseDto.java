package com.hyejin.portfolio.domain.project.dto;

import com.hyejin.portfolio.domain.project.entity.ProjectLinkEntity;
import com.hyejin.portfolio.domain.project.entity.ProjectLinkType;

/**
 * packageName    : com.hyejin.portfolio.domain.project.dto
 * fileName       : ProjectLinkResponseDto
 * author         : Song
 * date           : 2026-06-30
 * description    : 프로젝트 링크 응답 DTO
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-06-30        Song       최초 생성
 */

public record ProjectLinkResponseDto(
        Long projectLinkId,
        ProjectLinkType linkType,
        String linkName,
        String url,
        int displayOrder
) {

    public static ProjectLinkResponseDto from(ProjectLinkEntity link) {
        return new ProjectLinkResponseDto(
                link.getProjectLinkId(),
                link.getLinkType(),
                link.getLinkName(),
                link.getUrl(),
                link.getDisplayOrder()
        );
    }
}
