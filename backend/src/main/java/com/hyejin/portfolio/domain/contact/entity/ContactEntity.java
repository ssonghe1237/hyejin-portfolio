package com.hyejin.portfolio.domain.contact.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * packageName    : com.hyejin.portfolio.domain.contact.entity
 * fileName       : ContactEntity
 * author         : Song
 * date           : 2026-08-07
 * description    : Contact 페이지 콘텐츠 Entity
 *                  - 사용자 Contact 페이지 기본 정보 관리
 *                  - 이메일 및 외부 프로필 링크 관리
 *                  - 관리자 업로드 이력서 PDF 정보 관리
 *                  - 싱글턴 키 기준 단일 Contact 콘텐츠 관리
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-07        Song       최초 생성
 */

@Entity
@Table(
        name = "contact_profiles",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_contact_profiles_singleton_key",
                        columnNames = "singleton_key"
                )
        }
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ContactEntity {

    public static final String SINGLETON_KEY = "CONTACT";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "contact_id")
    private Long contactId;

    @Column(
            name = "singleton_key",
            nullable = false,
            updatable = false,
            length = 30
    )
    private String singletonKey;

    @Column(
            name = "heading",
            nullable = false,
            length = 200
    )
    private String heading;

    @Column(
            name = "description",
            nullable = false,
            length = 1000
    )
    private String description;

    @Column(
            name = "email",
            nullable = false,
            length = 255
    )
    private String email;

    @Column(
            name = "github_url",
            nullable = false,
            length = 500
    )
    private String githubUrl;

    @Column(
            name = "linkedin_url",
            length = 500
    )
    private String linkedinUrl;

    @Column(
            name = "resume_label",
            nullable = false,
            length = 100
    )
    private String resumeLabel;

    @Column(
            name = "resume_file_url",
            length = 1000
    )
    private String resumeFileUrl;

    @Column(
            name = "resume_original_file_name",
            length = 500
    )
    private String resumeOriginalFileName;

    @Column(
            name = "is_published",
            nullable = false
    )
    private boolean published;

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

    @Builder
    private ContactEntity(
            String heading,
            String description,
            String email,
            String githubUrl,
            String linkedinUrl,
            String resumeLabel,
            boolean published
    ) {
        this.singletonKey = SINGLETON_KEY;
        this.heading = heading;
        this.description = description;
        this.email = email;
        this.githubUrl = githubUrl;
        this.linkedinUrl = linkedinUrl;
        this.resumeLabel = resumeLabel;
        this.published = published;
    }

    // =====================================================================================
    // 기본 정보 수정
    // =====================================================================================

    public void updateBasicInfo(
            String heading,
            String description,
            String email,
            String githubUrl,
            String linkedinUrl,
            String resumeLabel
    ) {
        this.heading = heading;
        this.description = description;
        this.email = email;
        this.githubUrl = githubUrl;
        this.linkedinUrl = linkedinUrl;
        this.resumeLabel = resumeLabel;

        touch();
    }

    // =====================================================================================
    // 이력서 관리
    // =====================================================================================

    public void updateResume(
            String resumeFileUrl,
            String resumeOriginalFileName
    ) {
        this.resumeFileUrl = resumeFileUrl;
        this.resumeOriginalFileName = resumeOriginalFileName;

        touch();
    }

    public void removeResume() {
        this.resumeFileUrl = null;
        this.resumeOriginalFileName = null;

        touch();
    }

    // =====================================================================================
    // 공개 상태
    // =====================================================================================

    public void publish() {
        this.published = true;
        touch();
    }

    public void unpublish() {
        this.published = false;
        touch();
    }

    // =====================================================================================
    // 수정 시각
    // =====================================================================================

    public void touch() {
        this.updatedAt = LocalDateTime.now();
    }

    // =====================================================================================
    // JPA Lifecycle
    // =====================================================================================

    @PrePersist
    protected void onCreate() {
        LocalDateTime now =
                LocalDateTime.now();

        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt =
                LocalDateTime.now();
    }
}