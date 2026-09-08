package com.hyejin.portfolio.domain.project.dto;

import com.hyejin.portfolio.domain.project.entity.ProjectLinkType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

/**
 * packageName    : com.hyejin.portfolio.domain.project.dto
 * fileName       : AdminProjectLinkUpdateRequestDto
 * author         : Song
 * date           : 2026-07-08
 * description    : 관리자 프로젝트 링크 수정 요청 DTO
 *                  - projectLinkId가 있으면 기존 링크 수정
 *                  - projectLinkId가 없으면 신규 링크 등록
 *                  - 링크 삭제는 상위 DTO의 deletedLinkIds로 처리
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-07-08        Song       최초 생성
 */
public record AdminProjectLinkUpdateRequestDto(

        /*
         * null이면 신규 링크 등록
         * 값이 있으면 기존 링크 수정
         */
        @Positive(message = "프로젝트 링크 ID는 1 이상이어야 합니다.")
        Long projectLinkId,

        @NotNull(message = "링크 유형은 필수입니다.")
        ProjectLinkType linkType,

        @NotBlank(message = "링크 이름은 필수입니다.")
        String linkName,

        @NotBlank(message = "링크 URL은 필수입니다.")
        String url,

        @NotNull(message = "링크 표시 순서는 필수입니다.")
        @PositiveOrZero(message = "링크 표시 순서는 0 이상이어야 합니다.")
        Integer displayOrder

) {
}