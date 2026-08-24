package com.hyejin.portfolio.domain.about.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.BatchSize;

import java.time.LocalDateTime;
import java.time.LocalDate;
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
 *                  - 프로필 정보와 학력·수상·근무 이력·기술 연관관계 관리
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-04        Song       최초 생성
 * 2026-08-04        Song       About 싱글턴 키 및 DB UNIQUE 제약조건 추가
 * 2026-08-04        Song       JPA 연관관계 컬렉션 final 제거
 * 2026-08-24        Song       About 프로필 및 이력·기술 도메인 구조 확장
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

    @Column(name = "name_ko", length = 100)
    private String nameKo;

    @Column(name = "name_en", length = 100)
    private String nameEn;

    @Column(name = "profile_image_url", columnDefinition = "TEXT")
    private String profileImageUrl;

    @Column(name = "birth_date")
    private LocalDate birthDate;

    @Column(name = "position", length = 150)
    private String position;

    @Column(name = "background", length = 200)
    private String background;

    @Column(name = "current_focus", length = 200)
    private String currentFocus;

    @Column(name = "location", length = 200)
    private String location;

    @Column(name = "interests", length = 500)
    private String interests;

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
    private List<AboutCompetencyEntity> competencies = new ArrayList<>();

    // About 섹션
    @OneToMany(
            mappedBy = "about",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @OrderBy("displayOrder ASC, sectionId ASC")
    private List<AboutSectionEntity> sections = new ArrayList<>();

    @OneToMany(mappedBy = "about", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("displayOrder ASC, educationId ASC")
    private List<AboutEducationEntity> educations = new ArrayList<>();

    @OneToMany(mappedBy = "about", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("displayOrder ASC, awardId ASC")
    private List<AboutAwardEntity> awards = new ArrayList<>();

    @OneToMany(mappedBy = "about", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("displayOrder ASC, experienceId ASC")
    private List<AboutWorkExperienceEntity> workExperiences = new ArrayList<>();

    @OneToMany(mappedBy = "about", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("displayOrder ASC, skillCategoryId ASC")
    @BatchSize(size = 10)
    private List<AboutSkillCategoryEntity> skillCategories = new ArrayList<>();



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

    public void updateProfile(
            String nameKo, String nameEn, String profileImageUrl, LocalDate birthDate,
            String position, String background, String currentFocus,
            String location, String interests
    ) {
        this.nameKo = nameKo;
        this.nameEn = nameEn;
        this.profileImageUrl = profileImageUrl;
        this.birthDate = birthDate;
        this.position = position;
        this.background = background;
        this.currentFocus = currentFocus;
        this.location = location;
        this.interests = interests;
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

    public void replaceEducations(List<AboutEducationEntity> newEducations) {
        this.educations.clear();
        newEducations.forEach(education -> {
            education.assignAbout(this);
            this.educations.add(education);
        });
        touch();
    }

    public void replaceAwards(List<AboutAwardEntity> newAwards) {
        this.awards.clear();
        newAwards.forEach(award -> {
            award.assignAbout(this);
            this.awards.add(award);
        });
        touch();
    }

    public void replaceWorkExperiences(List<AboutWorkExperienceEntity> newWorkExperiences) {
        this.workExperiences.clear();
        newWorkExperiences.forEach(experience -> {
            experience.assignAbout(this);
            this.workExperiences.add(experience);
        });
        touch();
    }

    public void replaceSkillCategories(List<AboutSkillCategoryEntity> newSkillCategories) {
        this.skillCategories.clear();
        newSkillCategories.forEach(category -> {
            category.assignAbout(this);
            this.skillCategories.add(category);
        });
        touch();
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
