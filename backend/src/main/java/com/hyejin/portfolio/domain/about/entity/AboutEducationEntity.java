package com.hyejin.portfolio.domain.about.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * packageName    : com.hyejin.portfolio.domain.about.entity
 * fileName       : AboutEducationEntity
 * author         : Song
 * date           : 2026-08-20
 * description    : About 학력 및 교육 이력 Entity
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-21        Song       최초 생성
 */

@Entity
@Table(name = "about_educations")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class AboutEducationEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "education_id")
    private Long educationId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "about_id", nullable = false)
    private AboutEntity about;

    @Enumerated(EnumType.STRING)
    @Column(name = "education_type", nullable = false, length = 30)
    private AboutEducationType educationType;

    @Column(name = "institution_name", nullable = false, length = 200)
    private String institutionName;

    @Column(name = "course_name", nullable = false, length = 300)
    private String courseName;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "status", length = 100)
    private String status;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "display_order", nullable = false)
    private Integer displayOrder;

    @Builder
    private AboutEducationEntity(AboutEducationType educationType, String institutionName,
                                 String courseName, LocalDate startDate, LocalDate endDate,
                                 String status, String description, Integer displayOrder) {
        this.educationType = educationType;
        this.institutionName = institutionName;
        this.courseName = courseName;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
        this.description = description;
        this.displayOrder = displayOrder;
    }

    void assignAbout(AboutEntity about) {
        this.about = about;
    }
}
