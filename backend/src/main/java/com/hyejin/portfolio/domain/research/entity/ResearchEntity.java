package com.hyejin.portfolio.domain.research.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * packageName    : com.hyejin.portfolio.domain.research.entity
 * fileName       : ResearchEntity
 * author         : Song
 * date           : 2026-08-03
 * description    : 포트폴리오 Research 게시글 정보를 데이터베이스 테이블과 매핑하여 관리하는 엔티티 클래스
 *                  - Research 제목, 요약, 본문 HTML 및 카테고리 관리
 *                  - 공개 여부와 사용자 화면 노출 순서 관리
 *                  - 게시글 생성일, 수정일 및 최초 공개일 관리
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-03        Song       최초 생성
 */

@Entity
@Table(name = "research_posts")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ResearchEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "research_id")
    private Long researchId;

    // Research 게시글 제목
    @Column(nullable = false, unique = true, length = 200)
    private String title;

    // Research 상세 페이지 URL 식별자
    @Column(nullable = false, unique = true, length = 200)
    private String slug;

    // Research 목록 카드에 표시할 요약문
    @Column(nullable = false, columnDefinition = "TEXT")
    private String summary;

    // Tiptap 에디터에서 작성한 Research 본문 HTML
    // 서비스 계층에서 허용된 HTML 태그ㅏㄴ 남기도록 정제한 뒤 저장
    @Column(name = "content_html", nullable = false, columnDefinition = "TEXT")
    private String contentHtml;

    // Research 분류
    // 예) JAVA, SPRING, DATABASE, WEB, DEVOPS
    @Column(nullable = false, length = 100)
    private String category;

    @Column(name = "display_order", nullable = false)
    private Integer displayOrder;

    // 공개 여부
    // true: 공개/ false: 미공개
    @Column(name = "is_published", nullable = false)
    private boolean published;

    // 생성일
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    // 수정일
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // 최초 공개일
    // 비공개 상태로 작성된 게시글은 null
    @Column(name = "published_at")
    private LocalDateTime publishedAt;

    @Builder
    public ResearchEntity(
            String title,
            String slug,
            String summary,
            String contentHtml,
            String category,
            Integer displayOrder,
            boolean published
    ) {
        this.title = title;
        this.slug = slug;
        this.summary = summary;
        this.contentHtml = contentHtml;
        this.category = category;
        this.displayOrder = displayOrder;
        this.published = published;
    }

    // Reasearch 게시글이 최초 저장되기 직전에 생성일과 수정일을 자동 생성
    // 최초 등록부터 공개 상태라면 최초 공개일도 함께 생성
    @PrePersist
    public void prePersist() {
        LocalDateTime now = LocalDateTime.now();

        this.createdAt = now;
        this.updatedAt = now;

        if (this.published && this.publishedAt == null) {
            this.publishedAt = now;
        }
    }

    // Research 게시글이 수정되기 직전에 수정일을 자동 갱신
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Research 게시글 기본 정보 수정
    // 공개 여부는 published(), unpublished() 메서드에서 별도로 변경
    public void updateBasicInfo(
            String title,
            String slug,
            String summary,
            String contentHtml,
            String category,
            Integer displayOrder
    ) {
        this.title = title;
        this.slug = slug;
        this.summary = summary;
        this.contentHtml = contentHtml;
        this.category = category;
        this.displayOrder = displayOrder;
    }

    // Research 게시글 공개 처리
    // 최초 공개 시점에만 publishedAt을 생성
    public void publish() {
        this.published = true;

        if (this.publishedAt == null) {
            this.publishedAt = LocalDateTime.now();
        }
    }

    // Research 게시글 비공개 처리
    // 기존 최초 공개일은 이력 정보로 유지
    public void unpublished(){
        this.published = false;
    }
}
