package com.hyejin.portfolio.domain.auth.repository;

import com.hyejin.portfolio.domain.auth.entity.AdminUserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * packageName    : com.hyejin.portfolio.domain.auth.repository
 * fileName       : AdminUserRepository.java
 * author         : Song
 * date           : 2026-08-26
 * description    : 관리자 계정 Repository
 *                  - 관리자 로그인 ID 기반 계정 조회
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-26        Song               최초 생성
 */
public interface AdminUserRepository
        extends JpaRepository<AdminUserEntity, Long> {

    /**
     * 관리자 로그인 ID로 계정 조회
     */
    Optional<AdminUserEntity> findByUsername(String username);

    /**
     * 관리자 로그인 ID 중복 여부 확인
     */
    boolean existsByUsername(String username);
}