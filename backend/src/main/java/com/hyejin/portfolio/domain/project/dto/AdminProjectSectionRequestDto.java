package com.hyejin.portfolio.domain.project.dto;

import com.hyejin.portfolio.domain.project.entity.ProjectSectionType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.util.List;

/**
 * packageName    : com.hyejin.portfolio.domain.project.dto
 * fileName       : AdminProjectSectionRequestDto
 * author         : Song
 * date           : 2026-07-07
 * description    : 관리자 프로젝트 섹션 등록 요청 DTO
 *                  - 섹션 유형, 제목, 본문, 표시 순서 등록
 *                  - 섹션 설명에 사용되는 이미지 목록 포함
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-07-07        Song       최초 생성
 */

public record AdminProjectSectionRequestDto(
        @NotNull(message = "섹션 유형은 필수입니다.")
        ProjectSectionType sectionType,

        String title,

        String content,

        @PositiveOrZero(message = "섹션 표시 순서는 0 이상이어야 합니다.")
        int displayOrder,

        List<@Valid AdminProjectImageRequestDto> images
) {
    public AdminProjectSectionRequestDto {
        images = images == null ? List.of() : List.copyOf(images);
    }
}
