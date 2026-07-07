package com.hyejin.portfolio.domain.project.dto;

import com.hyejin.portfolio.domain.project.entity.ProjectLinkType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

/**
 * packageName    : com.hyejin.portfolio.domain.project.dto
 * fileName       : AdminProjectLinkRequestDto
 * author         : Song
 * date           : 2026-07-07
 * description    : 관리자 프로젝트 링크 등록 요청 DTO
 *                  - GitHub, 배포 URL, PDF, Notion 등의 링크 등록
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-07-07        Song       최초 생성
 */
public record AdminProjectLinkRequestDto(
        @NotNull(message = "링크 유형은 필수입니다.")
        ProjectLinkType linkType,

        @NotBlank(message = "링크 이름은 필수입니다.")
        String linkName,

        @NotBlank(message = "링크 URL은 필수입니다.")
        String url,

        @PositiveOrZero(message = "링크 표시 순서는 0 이상이어야 합니다.")
        int displayOrder

) {
}
