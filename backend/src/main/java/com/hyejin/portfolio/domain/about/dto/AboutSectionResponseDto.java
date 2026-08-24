package com.hyejin.portfolio.domain.about.dto;

import com.hyejin.portfolio.domain.about.entity.AboutSectionEntity;
import com.hyejin.portfolio.domain.about.entity.AboutSectionType;

/**
 * packageName    : com.hyejin.portfolio.domain.about.dto
 * fileName       : AboutSectionResponseDto
 * author         : Song
 * date           : 2026-08-05
 * description    : 사용자 About 섹션 응답 DTO
 *                  - 공개 About 페이지의 섹션 제목 제공
 *                  - 서버에서 정제된 Tiptap HTML 본문 제공
 *                  - 사용자 화면 표시 순서 제공
 *                  - 섹션 역할 유형 제공
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-05        Song       최초 생성
 * 2026-08-24        Song       About 섹션 유형 응답 정보 추가
 */
public record AboutSectionResponseDto(

        String title,

        String contentHtml,

        AboutSectionType sectionType,

        Integer displayOrder

) {

    public static AboutSectionResponseDto from(
            AboutSectionEntity section
    ) {
        return new AboutSectionResponseDto(
                section.getTitle(),
                section.getContentHtml(),
                section.getSectionType(),
                section.getDisplayOrder()
        );
    }
}
