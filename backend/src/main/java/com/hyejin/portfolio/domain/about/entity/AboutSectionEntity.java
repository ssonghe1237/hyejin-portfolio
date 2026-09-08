package com.hyejin.portfolio.domain.about.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * packageName    : com.hyejin.portfolio.domain.about.entity
 * fileName       : AboutSectionEntity
 * author         : Song
 * date           : 2026-08-04
 * description    : 포트폴리오 About 세부 섹션 Entity
 *                  - 경력, 기술, 개발 철학 등 About 섹션 관리
 *                  - Tiptap으로 작성한 HTML 본문 저장
 *                  - 표시 순서를 통한 사용자 화면 노출 순서 관리
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-04        Song       최초 생성
 * 2026-08-20        Song       자유 섹션의 역할을 명시적으로 구분하는 AboutSectionType 추가
 */

@Entity
@Table(name = "about_sections")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class AboutSectionEntity {

    // =====================================================================================
    // 기본키
    // =====================================================================================

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "section_id")
    private Long sectionId;

    // =====================================================================================
    // About 연관관계
    // =====================================================================================

    @ManyToOne(
            fetch = FetchType.LAZY,
            optional = false
    )
    @JoinColumn(
            name = "about_id",
            nullable = false
    )
    private AboutEntity about;

    // =====================================================================================
    // 섹션 정보
    // =====================================================================================

    @Column(
            name = "title",
            nullable = false,
            length = 150
    )
    private String title;

    @Column(
            name = "content_html",
            nullable = false,
            columnDefinition = "TEXT"
    )
    private String contentHtml;

    @Enumerated(EnumType.STRING)
    @Column(name = "section_type", length = 30)
    private AboutSectionType sectionType;

    @Column(
            name = "display_order",
            nullable = false
    )
    private Integer displayOrder;

    // =====================================================================================
    // 생성자
    // =====================================================================================

    @Builder
    private AboutSectionEntity(
            String title,
            String contentHtml,
            AboutSectionType sectionType,
            Integer displayOrder
    ) {
        this.title = title;
        this.contentHtml = contentHtml;
        this.sectionType = sectionType;
        this.displayOrder = displayOrder;
    }

    // =====================================================================================
    // About 연관관계 설정
    // =====================================================================================

    void assignAbout(
            AboutEntity about
    ) {
        this.about = about;
    }

    // =====================================================================================
    // 섹션 정보 수정
    // =====================================================================================

    public void update(
            String title,
            String contentHtml,
            AboutSectionType sectionType,
            Integer displayOrder
    ) {
        this.title = title;
        this.contentHtml = contentHtml;
        this.sectionType = sectionType;
        this.displayOrder = displayOrder;
    }
}
