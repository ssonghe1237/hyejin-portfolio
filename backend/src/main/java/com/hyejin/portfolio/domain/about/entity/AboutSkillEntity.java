package com.hyejin.portfolio.domain.about.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * packageName    : com.hyejin.portfolio.domain.about.entity
 * fileName       : AboutSkillEntity
 * author         : Song
 * date           : 2026-08-21
 * description    : About 기술명, 로고 URL, 설명과 표시 순서를 관리하는 Entity
 */
@Entity
@Table(name = "about_skills")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class AboutSkillEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "skill_id")
    private Long skillId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "skill_category_id", nullable = false)
    private AboutSkillCategoryEntity category;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "logo_url", columnDefinition = "TEXT")
    private String logoUrl;

    @Column(name = "description", length = 300)
    private String description;

    @Column(name = "display_order", nullable = false)
    private Integer displayOrder;

    @Builder
    private AboutSkillEntity(String name, String logoUrl, String description, Integer displayOrder) {
        this.name = name;
        this.logoUrl = logoUrl;
        this.description = description;
        this.displayOrder = displayOrder;
    }

    void assignCategory(AboutSkillCategoryEntity category) {
        this.category = category;
    }
}
