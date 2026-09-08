package com.hyejin.portfolio.domain.about.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * packageName    : com.hyejin.portfolio.domain.about.entity
 * fileName       : AboutWorkExperienceEntity
 * author         : Song
 * date           : 2026-08-20
 * description    : About 근무 이력 Entity
 */
@Entity
@Table(name = "about_work_experiences")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class AboutWorkExperienceEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "experience_id")
    private Long experienceId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "about_id", nullable = false)
    private AboutEntity about;

    @Column(name = "company_name", nullable = false, length = 200)
    private String companyName;
    @Column(name = "position_title", nullable = false, length = 200)
    private String positionTitle;
    @Enumerated(EnumType.STRING)
    @Column(name = "employment_type", nullable = false, length = 30)
    private AboutEmploymentType employmentType;
    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;
    @Column(name = "end_date")
    private LocalDate endDate;
    @Column(name = "description_html", nullable = false, columnDefinition = "TEXT")
    private String descriptionHtml;
    @Column(name = "display_order", nullable = false)
    private Integer displayOrder;

    @Builder
    private AboutWorkExperienceEntity(String companyName, String positionTitle,
                                      AboutEmploymentType employmentType, LocalDate startDate,
                                      LocalDate endDate, String descriptionHtml, Integer displayOrder) {
        this.companyName = companyName;
        this.positionTitle = positionTitle;
        this.employmentType = employmentType;
        this.startDate = startDate;
        this.endDate = endDate;
        this.descriptionHtml = descriptionHtml;
        this.displayOrder = displayOrder;
    }

    void assignAbout(AboutEntity about) { this.about = about; }
}
