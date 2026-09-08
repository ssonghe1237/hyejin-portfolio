package com.hyejin.portfolio.domain.project.dto;

import jakarta.validation.constraints.NotNull;

/**
 * packageName    : com.hyejin.portfolio.domain.project.dto
 * fileName       : AdminProjectPublicationUpdateRequestDto
 * author         : Song
 * date           : 2026-07-25
 * description    : 관리자 프로젝트 공개 상태 수정 요청 DTO
 *                  - 관리자 프로젝트 공개/숨김 상태 변경 요청 데이터 전달
 *                  - published 값으로 사용자 화면 노출 여부 제어
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-07-25        Song       최초 생성
 */
public record AdminProjectPublicationUpdateRequestDto(
        @NotNull(message = "공개 여부는 필수입니다.")
        Boolean published
) {


}
