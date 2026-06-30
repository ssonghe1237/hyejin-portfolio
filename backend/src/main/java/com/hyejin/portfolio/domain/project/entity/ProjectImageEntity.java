package com.hyejin.portfolio.domain.project.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * packageName    : com.hyejin.portfolio.domain.project.entity
 * fileName       : ProjectImageEntity
 * author         : Song
 * date           : 2026-06-25
 * description    : 프로젝트 이미지 Entity
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-06-25        Song       최초 생성
 * 2026-06-26        Song       메서드 추가
 */

@Entity
@Table(name = "project_images")
@Data
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ProjectImageEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "project_image_id")
    private Long projectImageId;

    // 연결된 프로젝트
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private ProjectEntity project;

    // 이미지 유형
    // THUMBNAIL, MAIN, DETAIL, ERD, ARCHITECTURE, SCREENSHOT
    @Enumerated(EnumType.STRING)
    @Column(name = "image_type", nullable = false, length = 50)
    private ProjectImageType imageType;

    // 이미지 URL
    @Column(name = "image_url", nullable = false, columnDefinition = "TEXT")
    private String imageUrl;

    // 이미지 설명
    @Column(length = 300)
    private String caption;

    // 이미지 표시 순서
    @Column(name = "display_order", nullable = false)
    private int displayOrder;

    @Builder
    public ProjectImageEntity(
            ProjectEntity project,
            ProjectImageType imageType,
            String imageUrl,
            String caption,
            int displayOrder
    ) {
        this.project = project;
        this.imageType = imageType;
        this.imageUrl = imageUrl;
        this.caption = caption;
        this.displayOrder = displayOrder;
    }

}
