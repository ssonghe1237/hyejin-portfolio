package com.hyejin.portfolio.domain.project.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * packageName    : com.hyejin.portfolio.domain.project.entity
 * fileName       : ProjectTechEntity
 * author         : Song
 * date           : 2026-06-25
 * description    : 프로젝트 기술스택 Entity
 *                  - project_techs 테이블과 매핑
 *                  - 하나의 프로젝트는 여러 기술스택을 가질 수 있음
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-06-25        Song       최초 생성
 * 2026-06-26        Song       메서드 추가
 */

@Entity
@Table(name = "project_techs")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ProjectTechEntity{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "project_tech_id")
    private Long projectTechId;

    // 연결된 프로젝트
    // N:1 관계 => 여러 기술스택이 하나의 프로젝트에 연결됨
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private ProjectEntity project;

    // 기술명
    // 예 : Spring Boot, React, PostgreSQL
    @Column(name = "tech_name", nullable = false, length = 100)
    private String techName;

    // 기술 분류
    // 에 : Frontend, Backend, Database, Infra, AI
    @Column(name = "tech_category", length = 100)
    private String techCategory;

    // 기술스택 표시 순서
    @Column(name = "display_order", nullable = false)
    private int displayOrder;

    @Builder
    public ProjectTechEntity(
            ProjectEntity project,
            String techName,
            String techCategory,
            int displayOrder
    ) {
        this.project = project;
        this.techName = techName;
        this.techCategory = techCategory;
        this.displayOrder = displayOrder;
    }

}
