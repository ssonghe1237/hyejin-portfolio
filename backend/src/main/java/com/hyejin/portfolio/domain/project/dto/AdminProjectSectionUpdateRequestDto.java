package com.hyejin.portfolio.domain.project.dto;

import com.hyejin.portfolio.domain.project.entity.ProjectSectionType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

import java.util.List;

/**
 * packageName    : com.hyejin.portfolio.domain.project.dto
 * fileName       : AdminProjectSectionUpdateRequestDto
 * author         : Song
 * date           : 2026-07-08
 * description    : 관리자 프로젝트 상세 섹션 수정 요청 DTO
 *                  - sectionId가 있으면 기존 섹션 수정
 *                  - sectionId가 없으면 신규 섹션 등록
 *                  - 기존 섹션 이미지 수정 및 신규 이미지 등록
 *                  - 이미지 삭제는 상위 요청 DTO의 deletedImageIds로 처리
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-07-08        Song       최초 생성
 */
public record AdminProjectSectionUpdateRequestDto(

        // null이면 신규 섹션 등록  |  값이 있으면 기존 섹션 수정
        @Positive(message = "프로젝트 섹션 ID는 1 이상이어야 합니다.")
        Long sectionId,

        @NotNull(message = "프로젝트 섹션 유형은 필수입니다.")
        ProjectSectionType sectionType,

        String title,

        // 일반 텍스트, Markdown, Mermaid 문법 등을 저장
        String content,

        @NotNull(message = "프로젝트 섹션 표시 순서는 필수입니다.")
        @PositiveOrZero(message = "프로젝트 섹션 표시 순서는 0 이상이어야 합니다.")
        Integer displayOrder,

        /*
         * projectImageId가 있으면 기존 섹션 이미지 수정
         * projectImageId가 없으면 신규 섹션 이미지 등록
         *
         * 기존 이미지 삭제는 상위 DTO의 deletedImageIds에
         * 해당 projectImageId를 전달하여 처리
         *
         * 수정하거나 추가할 이미지가 없으면 빈 배열 []을 전달
         */
        @NotNull(message = "프로젝트 섹션 이미지 목록은 필수입니다.")
        List<@Valid AdminProjectImageUpdateRequestDto> images

) {
    // 전달받은 이미지 목록을 불변 리스트로 변환
    public AdminProjectSectionUpdateRequestDto {

        if (images != null) {
            images = List.copyOf(images);
        }
    }
}