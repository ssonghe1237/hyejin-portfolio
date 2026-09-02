package com.hyejin.portfolio.domain.auth.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * packageName    : com.hyejin.portfolio.domain.auth.entity
 * fileName       : AdminUserEntity.java
 * author         : Song
 * date           : 2026-08-26
 * description    : 관리자 로그인 계정 Entity
 *                  - 관리자 아이디 및 암호화 비밀번호 저장
 *                  - 관리자 권한 및 계정 활성 상태 관리
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-26        Song               최초 생성
 */

@Entity
@Table(
        name = "admin_users",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_admin_users_username",
                        columnNames = "username"
                )
        }
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class AdminUserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "admin_user_id")
    private Long adminUserId;

    // 관리자 로그인 ID
    @Column(
            name = "username",
            nullable = false,
            length = 100
    )
    private String username;

    @Column(
            name = "password_hash",
            nullable = false,
            length = 100
    )
    private String passwordHash;

    // 관리자 권한
    // DB: ADMIN  |  Spring Security: ROLE_ADMIN
    @Enumerated(EnumType.STRING)
    @Column(
            name = "role",
            nullable = false,
            length = 30
    )
    private AdminRole role;

    // 계정 활성 여부
    @Column(
            name = "enabled",
            nullable = false
    )
    private boolean enabled;

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

    // 관리자 계정 생성
    public AdminUserEntity(
            String username,
            String passwordHash,
            AdminRole role
    ) {
        this.username = username;
        this.passwordHash = passwordHash;
        this.role = role;
    }

    // Entity 최초 저장 전 실행
    @PrePersist
    protected void onCreate(){

        LocalDateTime now = LocalDateTime.now();

        this.createdAt = now;
        this.updatedAt = now;
    }

    // Entity 수정 전 실행
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
