package com.hyejin.portfolio.domain.about.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * packageName    : com.hyejin.portfolio.domain.about.entity
 * fileName       : AboutCompetencyEntity
 * author         : Song
 * date           : 2026-08-07
 * description    : About 핵심 역량 Entity
 *                  - 관리자 About 화면에서 핵심 역량 관리
 *                  - Home 및 About 사용자 화면에서 공통 사용
 *                  - 역량 제목, 설명, 표시 순서 관리
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-07        Song       최초 생성
 */

@Entity
@Table(name = "about_competencies")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class AboutCompetencyEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "competency_id")
    private Long competencyId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "about_id",
            nullable = false
    )
    private AboutEntity about;

    @Column(
            name = "title",
            nullable = false,
            length = 150
    )
    private String title;

    @Column(
            name = "description",
            nullable = false,
            length = 1000
    )
    private String description;

    @Column(
            name = "display_order",
            nullable = false
    )
    private Integer displayOrder;

    @Builder
    private AboutCompetencyEntity(
            String title,
            String description,
            Integer displayOrder
    ) {
        this.title = title;
        this.description = description;
        this.displayOrder = displayOrder;
    }

    // About 연관관계 설정
    void assignAbout(
            AboutEntity about
    ) {
        this.about = about;
    }
}