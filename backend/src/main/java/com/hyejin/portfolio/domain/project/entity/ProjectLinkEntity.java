package com.hyejin.portfolio.domain.project.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * packageName    : com.hyejin.portfolio.domain.project.entity
 * fileName       : ProjectLinkEntity
 * author         : Song
 * date           : 2026-06-26
 * description    : 프로젝트 링크 Entity
 *                  - project_links 테이블과 매핑
 *                  - 프로젝트 관련 외부 링크를 관리
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-06-26        Song       최초 생성
 */

@Entity
@Table(name = "project_links")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ProjectLinkEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "project_link_id")
    private Long projectLinkId;

    // 연결된 프로젝트
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private ProjectEntity project;

    // 링크 유형
    // GITHUB, DEPLOY, PDF, NOTION, RESUME, SARAMIN, ETC
    @Enumerated(EnumType.STRING)
    @Column(name = "link_type", nullable = false, length = 50)
    private ProjectLinkType linkType;

    // 링크 표시명
    @Column(name = "link_name", nullable = false, length = 100)
    private String linkName;

    // 실제 URL
    @Column(nullable = false, columnDefinition = "TEXT")
    private String url;

    // 링크 표시 순서
    @Column(name = "display_order", nullable = false)
    private int displayOrder;

    @Builder
    public ProjectLinkEntity(
            ProjectEntity project,
            ProjectLinkType linkType,
            String linkName,
            String url,
            int displayOrder
    ) {
        this.project = project;
        this.linkType = linkType;
        this.linkName = linkName;
        this.url = url;
        this.displayOrder = displayOrder;
    }

}
