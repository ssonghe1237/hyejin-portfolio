package com.hyejin.portfolio.domain.project.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

/**
 * packageName    : com.hyejin.portfolio.domain.project.dto
 * fileName       : AdminProjectTechUpdateRequestDto
 * author         : Song
 * date           : 2026-07-08
 * description    : 관리자 프로젝트 기술스택 수정 요청 DTO
 *                  - projectTechId가 있으면 기존 기술스택 수정
 *                  - projectTechId가 없으면 신규 기술스택 등록
 *                  - 기술스택 삭제는 상위 DTO의 deletedTechIds로 처리
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-07-08        Song       최초 생성
 */
public record AdminProjectTechUpdateRequestDto(

        /*
         * null이면 신규 기술스택 등록
         * 값이 있으면 기존 기술스택 수정
         */
        @Positive(message = "프로젝트 기술스택 ID는 1 이상이어야 합니다.")
        Long projectTechId,

        @NotBlank(message = "기술스택 이름은 필수입니다.")
        String techName,

        /*
         * 기술 분류는 필수가 아니므로 null 또는 빈 문자열 허용
         * Service에서 trimToNull()을 적용하여 저장
         */
        String techCategory,

        @NotNull(message = "기술스택 표시 순서는 필수입니다.")
        @PositiveOrZero(message = "기술스택 표시 순서는 0 이상이어야 합니다.")
        Integer displayOrder

) {
}