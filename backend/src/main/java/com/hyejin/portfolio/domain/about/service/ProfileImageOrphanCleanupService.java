package com.hyejin.portfolio.domain.about.service;

/**
 * packageName    : com.hyejin.portfolio.domain.about.service
 * fileName       : ProfileImageOrphanCleanupService
 * author         : Song
 * date           : 2026-08-21
 * description    : 관리자 About 프로필 고아 이미지 정리 Service 인터페이스
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-21        Song       최초 생성
 */

public interface ProfileImageOrphanCleanupService {
    // 고아 이미지 정리
    void cleanupOrphanImages();
}
