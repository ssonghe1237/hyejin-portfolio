package com.hyejin.portfolio.domain.project.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * packageName    : com.hyejin.portfolio.domain.project.entity
 * fileName       : ProjectSectionEntity
 * author         : Song
 * date           : 2026-06-25
 * description    : 프로젝트 상세 섹션 Entity
 *                  - project_sections 테이블과 매핑
 *                  - 상세 페이지의 섹션 단위 내용을 관리
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-06-25        Song       최초 생성
 */

@Entity
@Table(name = "project_sections")
@Data
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ProjectSectionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "section_id")
    private Long sectionId;

    // 연결된 프로젝트
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private ProjectEntity project;

    // 상세 섹션 유형
    @Enumerated(EnumType.STRING)
    @Column(name = "section_type", nullable = false, length = 100)
    private ProjectSectionType sectionType;

    // 센션 제목
    @Column(length = 200)
    private String title;

    // 섹션 본문
    // 일반 텍스트, Markdown, Mermaid 문법 등을 저장
    @Column(columnDefinition = "TEXT")
    private String content;

    // 섹션 표시 순서
    @Column(name = "display_order", nullable = false)
    private int displayOrder;

    @Builder
    public ProjectSectionEntity(
            ProjectEntity project,
            ProjectSectionType sectionType,
            String title,
            String content,
            int displayOrder
    ) {
        this.project = project;
        this.sectionType = sectionType;
        this.title = title;
        this.content = content;
        this.displayOrder = displayOrder;
    }

}
