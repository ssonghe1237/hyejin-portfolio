package com.hyejin.portfolio.domain.about.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.BatchSize;

import java.util.ArrayList;
import java.util.List;

/**
 * packageName    : com.hyejin.portfolio.domain.about.entity
 * fileName       : AboutSkillCategoryEntity
 * author         : Song
 * date           : 2026-08-21
 * description    : About 기술 카테고리와 하위 기술 목록을 관리하는 Entity
 */
@Entity
@Table(name = "about_skill_categories")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class AboutSkillCategoryEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "skill_category_id")
    private Long skillCategoryId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "about_id", nullable = false)
    private AboutEntity about;

    @Column(name = "title", nullable = false, length = 150)
    private String title;

    @Column(name = "description", length = 500)
    private String description;

    @Column(name = "display_order", nullable = false)
    private Integer displayOrder;

    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("displayOrder ASC, skillId ASC")
    @BatchSize(size = 30)
    private List<AboutSkillEntity> skills = new ArrayList<>();

    @Builder
    private AboutSkillCategoryEntity(
            String title, String description, Integer displayOrder,
            List<AboutSkillEntity> skills
    ) {
        this.title = title;
        this.description = description;
        this.displayOrder = displayOrder;
        replaceSkills(skills == null ? List.of() : skills);
    }

    void assignAbout(AboutEntity about) {
        this.about = about;
    }

    private void addSkill(AboutSkillEntity skill) {
        skill.assignCategory(this);
        this.skills.add(skill);
    }

    public void replaceSkills(List<AboutSkillEntity> newSkills) {
        this.skills.clear();
        newSkills.forEach(this::addSkill);
    }
}
