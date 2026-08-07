package com.hyejin.portfolio.domain.about.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * packageName    : com.hyejin.portfolio.domain.about.entity
 * fileName       : AboutEntity
 * author         : Song
 * date           : 2026-08-04
 * description    : 포트폴리오 About 콘텐츠 Entity
 *                  - 사이트에 하나만 존재하는 About 기본 정보 관리
 *                  - 제목, 소개 요약, CTA 및 공개 상태 관리
 *                  - About 세부 섹션을 Aggregate Root에서 관리
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-04        Song       최초 생성
 * 2026-08-04        Song       About 싱글턴 키 및 DB UNIQUE 제약조건 추가
 * 2026-08-04        Song       JPA 연관관계 컬렉션 final 제거
 */

@Entity
@Table(
        name = "about_profiles",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_about_profiles_singleton_key",
                        columnNames = "singleton_key"
                )
        }
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class AboutEntity {

    public static final String SINGLETON_KEY = "ABOUT";

    @Column(
            name = "singleton_key",
            nullable = false,
            updatable = false,
            length = 30
    )
    private String singletonKey;

    // =====================================================================================
    // 기본키
    // =====================================================================================

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "about_id")
    private Long aboutId;

    // =====================================================================================
    // 기본 정보
    // =====================================================================================

    @Column(
            name = "heading",
            nullable = false,
            length = 200
    )
    private String heading;

    @Column(
            name = "summary",
            nullable = false,
            length = 1000
    )
    private String summary;

    @Column(
            name = "cta_label",
            nullable = false,
            length = 100
    )
    private String ctaLabel;

    @Column(
            name = "cta_url",
            nullable = false,
            length = 500
    )
    private String ctaUrl;

    @Column(
            name = "is_published",
            nullable = false
    )
    private boolean published;

    // =====================================================================================
    // About 섹션 & competencies 영역
    // =====================================================================================

    // competencies 영역
    @OneToMany(
            mappedBy = "about",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @OrderBy("displayOrder ASC, competencyId ASC")
    private List<AboutCompetencyEntity> competencies =
            new ArrayList<>();

    // About 섹션
    @OneToMany(
            mappedBy = "about",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @OrderBy("displayOrder ASC, sectionId ASC")
    private List<AboutSectionEntity> sections =
            new ArrayList<>();



    // =====================================================================================
    // 생성·수정 일시
    // =====================================================================================

    @Column(
            name = "created_at",
            nullable = false,
            updatable = false
    )
    private LocalDateTime createdAt;

    @Column(
            name = "updated_at",
            nullable = false
    )
    private LocalDateTime updatedAt;

    // =====================================================================================
    // 생성자
    // =====================================================================================

    @Builder
    private AboutEntity(
            String heading,
            String summary,
            String ctaLabel,
            String ctaUrl,
            boolean published
    ) {
        this.singletonKey = SINGLETON_KEY;
        this.heading = heading;
        this.summary = summary;
        this.ctaLabel = ctaLabel;
        this.ctaUrl = ctaUrl;
        this.published = published;
    }

    // =====================================================================================
    // About 기본 정보 수정
    // =====================================================================================

    public void updateBasicInfo(
            String heading,
            String summary,
            String ctaLabel,
            String ctaUrl
    ) {
        this.heading = heading;
        this.summary = summary;
        this.ctaLabel = ctaLabel;
        this.ctaUrl = ctaUrl;
    }

    // =====================================================================================
    // competencies 관리
    // =====================================================================================
    // assignAbout 상태 관리
    private void addCompetency(
            AboutCompetencyEntity competency
    ) {
        competency.assignAbout(this);
        this.competencies.add(competency);
    }

    // assignAbout 전체 교체
    public void replaceCompetencies(
            List<AboutCompetencyEntity> newCompetencies
    ) {
        this.competencies.clear();

        newCompetencies.forEach(
                this::addCompetency
        );

        touch();
    }

    // =====================================================================================
    // About 섹션 관리
    // =====================================================================================

    public void replaceSections(
            List<AboutSectionEntity> newSections
    ) {
        this.sections.clear();

        newSections.forEach(
                this::addSection
        );

        // 수정 시각 갱신
        touch();
    }

    private void addSection(
            AboutSectionEntity section
    ) {
        this.sections.add(section);

        // About 연관관계 설정
        section.assignAbout(this);
    }

    // =====================================================================================
    // 공개 상태 관리
    // =====================================================================================

    public void publish() {
        this.published = true;
    }

    public void unpublish() {
        this.published = false;
    }

    // =====================================================================================
    // 수정 시각 갱신
    // =====================================================================================

    public void touch() {
        this.updatedAt =
                LocalDateTime.now();
    }

    // =====================================================================================
    // Entity 생명주기
    // =====================================================================================

    @PrePersist
    private void prePersist() {
        LocalDateTime now =
                LocalDateTime.now();

        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    private void preUpdate() {
        this.updatedAt =
                LocalDateTime.now();
    }




}