package com.hyejin.portfolio.domain.about.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * packageName    : com.hyejin.portfolio.domain.about.entity
 * fileName       : AboutAwardEntity
 * author         : Song
 * date           : 2026-08-21
 * description    : About 수상 이력 Entity
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-21        Song       최초 생성
 */

@Entity
@Table(name = "about_awards")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class AboutAwardEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "award_id")
    private Long awardId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "about_id", nullable = false)
    private AboutEntity about;

    @Column(name = "title", nullable = false, length = 200)
    private String title;
    @Column(name = "issuer", nullable = false, length = 200)
    private String issuer;
    @Column(name = "awarded_date", nullable = false)
    private LocalDate awardedDate;
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    @Column(name = "display_order", nullable = false)
    private Integer displayOrder;

    @Builder
    private AboutAwardEntity(String title, String issuer, LocalDate awardedDate,
                             String description, Integer displayOrder) {
        this.title = title;
        this.issuer = issuer;
        this.awardedDate = awardedDate;
        this.description = description;
        this.displayOrder = displayOrder;
    }

    void assignAbout(AboutEntity about) { this.about = about; }
}
