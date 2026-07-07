package com.hyejin.portfolio.domain.project.dto;

import com.hyejin.portfolio.domain.project.entity.ProjectImageType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

/**
 * packageName    : com.hyejin.portfolio.domain.project.dto
 * fileName       : AdminProjectImageRequestDto
 * author         : Song
 * date           : 2026-07-07
 * description    : 관리자 프로젝트 이미지 등록 요청 DTO
 *                 - 썸네일, 대표 이미지, 섹션별 이미지 등록 시 사용
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-07-07        Song       최초 생성
 */
public record AdminProjectImageRequestDto(
        @NotNull(message = "이미지 유형은 필수입니다.")
        ProjectImageType imageType,

        @NotBlank(message = "이미지 URL은 필수입니다.")
        String imageUrl,

        @Size(max = 300, message = "이미지 설명은 300자 이하여야 합니다.")
        String caption,

        @PositiveOrZero(message = "이미지 표시 순서는 0 이상이어야 합니다.")
        int displayOrder
) {


}
