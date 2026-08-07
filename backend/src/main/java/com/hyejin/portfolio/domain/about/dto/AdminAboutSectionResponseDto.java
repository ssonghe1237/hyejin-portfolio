package com.hyejin.portfolio.domain.about.dto;

import com.hyejin.portfolio.domain.about.entity.AboutSectionEntity;

/**
 * packageName    : com.hyejin.portfolio.domain.about.dto
 * fileName       : AdminAboutSectionResponseDto
 * author         : Song
 * date           : 2026-08-04
 * description    : 관리자 About 섹션 응답 DTO
 *                  - About 섹션 식별값과 저장된 본문 정보 제공
 *                  - 관리자 About 수정 화면 초기값으로 사용
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-04        Song       최초 생성
 */
public record AdminAboutSectionResponseDto(

        Long sectionId,

        String title,

        String contentHtml,

        Integer displayOrder

) {

    public static AdminAboutSectionResponseDto from(
            AboutSectionEntity section
    ) {
        return new AdminAboutSectionResponseDto(
                section.getSectionId(),
                section.getTitle(),
                section.getContentHtml(),
                section.getDisplayOrder()
        );
    }
}