package com.hyejin.portfolio.domain.project.dto;

import com.hyejin.portfolio.domain.project.entity.ProjectImageType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

/**
 * packageName    : com.hyejin.portfolio.domain.project.dto
 * fileName       : AdminProjectImageUpdateRequestDto
 * author         : Song
 * date           : 2026-07-08
 * description    : 관리자 프로젝트 이미지 수정 요청 DTO
 *                  - projectImageId가 있으면 기존 이미지 수정
 *                  - projectImageId가 없으면 신규 이미지 등록
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-07-08        Song       최초 생성
 */
public record AdminProjectImageUpdateRequestDto(

        /*
         * null : 신규 이미지
         * 값 있음 : 기존 이미지 수정
         */
        @Positive(message = "프로젝트 이미지 ID는 1 이상이어야 합니다.")
        Long projectImageId,

        @NotNull(message = "이미지 유형은 필수입니다.")
        ProjectImageType imageType,

        @NotBlank(message = "이미지 URL은 필수입니다.")
        String imageUrl,

        String caption,

        @NotNull(message = "이미지 표시 순서는 필수입니다.")
        @PositiveOrZero(message = "이미지 표시 순서는 0 이상이어야 합니다.")
        Integer displayOrder

) {
}